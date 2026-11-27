// Captures the documentation screenshots from a running app, in light and
// dark mode, by driving headless Chrome over the DevTools protocol.
//
// SHOT_SET picks the pages:
// - dashboard (the default): load demo data first (`npm run db:demo`) and
//   sign in as an account in the default organization.
// - billing: run `npm run db:demo-billing` first, sign in as an admin of
//   its demo-billing organization, and set SHOT_PORTAL_PATH to the portal
//   link it prints (/portal/...).
//
// SHOT_PAGES (optional) captures only the named pages of the set, e.g.
// "overview,spend,breakdown" or "revenue,portal". Every page but
// portal-links and team (admin only) reads fine as a viewer.
//
// Usage: SHOT_EMAIL=... SHOT_PASSWORD=... node scripts/screenshots.mjs [base URL] [output dir]
// CHROME_PATH overrides the browser (default: google-chrome).

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "docs/screenshots";
const chrome = process.env.CHROME_PATH ?? "google-chrome";
const email = process.env.SHOT_EMAIL;
const password = process.env.SHOT_PASSWORD;
assert.ok(email && password, "set SHOT_EMAIL and SHOT_PASSWORD");

/** The UTC month before this one, as /revenue takes it: YYYY-MM. */
function lastMonth(now = new Date()) {
  const first = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  return new Date(first - 86_400_000).toISOString().slice(0, 7);
}

const SETS = {
  dashboard: () => [
    ["overview", "/overview"],
    ["spend", "/spend?range=90"],
    ["usage", "/usage"],
    ["projects", "/projects"],
    // Cost per resolved ticket within the project that resolves tickets;
    // across all projects, a customer's other spend would count too.
    [
      "breakdown",
      "/breakdown?range=90&outcome=ticket_resolved&project={Support Bot}",
    ],
    ["changes", "/changes"],
    ["savings", "/savings"],
    ["prices", "/prices"],
  ],
  billing: () => [
    ["revenue", `/revenue?month=${lastMonth()}`],
    ["portal-links", "/revenue/portal"],
    ["team", "/team"],
    // Checked below, only when the portal is captured.
    ["portal", process.env.SHOT_PORTAL_PATH],
  ],
};
const set = process.env.SHOT_SET ?? "dashboard";
assert.ok(
  Object.hasOwn(SETS, set),
  `SHOT_SET must be one of: ${Object.keys(SETS).join(", ")}`,
);
const wanted = process.env.SHOT_PAGES?.split(",")
  .map((name) => name.trim())
  .filter(Boolean);
const all = SETS[set]();
for (const name of wanted ?? []) {
  assert.ok(
    all.some(([page]) => page === name),
    `SHOT_PAGES: no page "${name}" in the ${set} set (${all.map(([page]) => page).join(", ")})`,
  );
}
const PAGES = wanted ? all.filter(([page]) => wanted.includes(page)) : all;
if (PAGES.some(([page]) => page === "portal")) {
  const portal = PAGES.find(([page]) => page === "portal")[1];
  assert.ok(
    portal && /^\/portal\/[A-Za-z0-9_-]+$/.test(portal),
    "set SHOT_PORTAL_PATH to the /portal/... link db:demo-billing prints",
  );
}
const VIEWPORT = { width: 1280, height: 900, deviceScaleFactor: 1 };

const profile = await mkdtemp(path.join(tmpdir(), "screenshots-"));
const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

try {
  // Chrome prints its DevTools address on standard error.
  const wsUrl = await new Promise((resolve, reject) => {
    let output = "";
    browser.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) resolve(match[1]);
    });
    browser.on("error", reject);
    browser.on("exit", (code) => reject(new Error(`Chrome exited (${code})`)));
  });

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 0;
  const pending = new Map();
  // Replies to commands; events aren't needed, since pages are awaited
  // by checking what the tab shows.
  ws.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  };
  const send = (method, params = {}, sessionId) => {
    const id = ++nextId;
    ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) =>
      pending.set(id, { resolve, reject }),
    );
  };

  const { targetId } = await send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const page = (method, params) => send(method, params, sessionId);

  async function evaluate(expression) {
    const { result, exceptionDetails } = await page("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text);
    return result.value;
  }

  async function waitFor(expression, what) {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error(`Timed out waiting for ${what}`);
  }

  /** Whether the tab shows `pathname` (a path, no query) fully loaded. */
  const settledOn = (pathname) =>
    `location.pathname === ${JSON.stringify(pathname)} && document.readyState === "complete"`;

  // A load event can be a late one from the page before, such as the
  // redirect after signing in, so wait until the tab is on the page asked
  // for and has finished loading it.
  async function open(pathname) {
    const target = new URL(base + pathname).pathname;
    // Mark the page being left, so even reopening the same path waits
    // for a new document rather than finding the old one finished.
    await evaluate(`window.__leaving = true`);
    await page("Page.navigate", { url: base + pathname });
    await waitFor(
      `!window.__leaving && ${settledOn(target)}`,
      `${target} to load`,
    );
  }

  await page("Page.enable");
  await page("Emulation.setDeviceMetricsOverride", {
    ...VIEWPORT,
    mobile: false,
  });

  // Sign in through the real form.
  await open("/login");
  await evaluate(`(() => {
    const form = document.querySelector("form");
    form.email.value = ${JSON.stringify(email)};
    form.password.value = ${JSON.stringify(password)};
    form.requestSubmit();
  })()`);
  await waitFor(settledOn("/overview"), "sign-in");

  // Paths name projects as {Name}; the pages take generated IDs, so read
  // them from the project selector.
  let projectIds = {};
  if (PAGES.some(([, pathname]) => pathname.includes("{"))) {
    await open("/breakdown");
    await waitFor(
      `document.querySelectorAll("#project option[value]:not([value=''])").length > 0`,
      "the project selector",
    );
    projectIds = await evaluate(`Object.fromEntries(
      [...document.querySelectorAll("#project option")]
        .filter((option) => option.value)
        .map((option) => [option.textContent, option.value]),
    )`);
  }
  const resolve = (pathname) =>
    pathname.replace(/\{([^}]+)\}/g, (_, name) => {
      assert.ok(projectIds[name], `no project named ${name}`);
      return encodeURIComponent(projectIds[name]);
    });

  await mkdir(outDir, { recursive: true });
  for (const scheme of ["light", "dark"]) {
    await page("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: scheme }],
    });
    for (const [name, pathname] of PAGES) {
      await open(resolve(pathname));
      await evaluate(`document.fonts.ready.then(() => true)`);
      // The dev server's floating indicator isn't part of the app.
      await evaluate(
        `document.querySelectorAll("nextjs-portal").forEach((el) => el.remove())`,
      );
      const { data } = await page("Page.captureScreenshot", { format: "png" });
      const file = path.join(outDir, `${name}-${scheme}.png`);
      await writeFile(file, Buffer.from(data, "base64"));
      console.log(`- ${file}`);
    }
  }
  ws.close();
} finally {
  // Wait for the browser to let go of its profile before deleting it, and
  // never let cleanup hide the error that got us here.
  if (browser.exitCode === null) {
    const exited = new Promise((resolve) => browser.once("exit", resolve));
    browser.kill();
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5 }).catch(
    () => {},
  );
}
