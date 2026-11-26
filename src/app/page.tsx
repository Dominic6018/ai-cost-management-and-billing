import Link from "next/link";
import {
  PRODUCT_CATEGORY,
  PRODUCT_NAME,
  PRODUCT_SECONDARY_TAGLINE,
  PRODUCT_TAGLINE,
  REPOSITORY_URL,
} from "@/lib/product";

// Each claim here is something the product does today; keep it that way.
const VALUE = [
  {
    title: "AI cost intelligence",
    outcome: "Understand where every AI dollar goes.",
    body: "Every request is priced exactly, at the rate in effect when it ran, and broken down by customer, feature, agent run, model and project. See why spend changed, and check the totals against your provider bills.",
  },
  {
    title: "Budget and spend control",
    outcome: "Prevent unexpected AI expenses.",
    body: "Monthly and per-run budgets with alerts by email, Slack or webhook, month-end forecasts and spike detection. Agents that check before each step stop before they go over.",
  },
  {
    title: "Usage-based billing",
    outcome: "Turn AI consumption into customer revenue.",
    body: "Plans with a monthly fee, included usage and a markup, monthly usage charges, prepaid credit, and draft invoices in Stripe for you to review and send.",
  },
  {
    title: "Customer margins",
    outcome: "Know which customers earn more than they cost.",
    body: "Each customer's revenue next to the AI API cost of serving them, month by month. Customers get a read-only portal with their own statement, never your costs.",
  },
  {
    title: "Multi-provider visibility",
    outcome: "All of your AI spend in one place.",
    body: "OpenAI, Anthropic and Google Gemini through drop-in TypeScript and Python clients or OpenTelemetry, including streaming, batch and cached tokens. Other providers report through the HTTP API.",
  },
  {
    title: "Self-hosted infrastructure",
    outcome: "Keep financial data under your control.",
    body: "Runs on your infrastructure with Docker, or on Vercel with your own Postgres. Only token counts are sent, never prompts or responses. Roles, single sign-on and an audit log are included.",
  },
];

const STEPS = [
  {
    title: "Report usage",
    body: "Wrap your provider calls with a client, send OpenTelemetry traces, or post token counts to the API.",
  },
  {
    title: "See the cost",
    body: "Each request is priced against dated, sourced model prices and attributed to the customer, feature and run behind it.",
  },
  {
    title: "Control and bill it",
    body: "Hold spend within budget, charge customers for what they used, and compare what each one earns with what they cost.",
  },
];

const AUDIENCES = [
  "AI-powered SaaS companies",
  "AI agent and automation agencies",
  "AI application development companies",
  "Enterprise AI engineering teams",
  "Businesses running multi-tenant AI applications",
];

const TRUST = [
  "Exact money arithmetic, never floating point",
  "API keys and sessions stored only as hashes",
  "Open source under the MIT license",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-4 py-16 sm:px-8">
      <header className="flex flex-col gap-5">
        <p className="text-sm text-foreground/60">
          <span className="font-semibold text-foreground">{PRODUCT_NAME}</span>
          {" · "}
          {PRODUCT_CATEGORY}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {PRODUCT_TAGLINE}
        </h1>
        <p className="max-w-2xl text-lg text-foreground/70">
          {PRODUCT_NAME} is an open-source AI cost intelligence and usage-based
          billing platform for AI-powered businesses. Track what every API call
          costs, keep spending within budget, bill customers for their usage,
          and see which customers are worth serving.
        </p>
        <p className="font-medium">{PRODUCT_SECONDARY_TAGLINE}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-md bg-foreground px-4 py-2 font-medium text-background"
          >
            Sign in
          </Link>
          <a
            href={REPOSITORY_URL}
            className="rounded-md border border-foreground/20 px-4 py-2 font-medium"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <section aria-labelledby="value" className="flex flex-col gap-6">
        <h2 id="value" className="text-2xl font-semibold tracking-tight">
          From AI spend to AI revenue
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-2 rounded-lg border border-foreground/10 p-5"
            >
              <h3 className="text-sm font-medium text-foreground/60">
                {item.title}
              </h3>
              <p className="font-semibold">{item.outcome}</p>
              <p className="text-sm text-foreground/70">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="flex flex-col gap-6">
        <h2 id="how" className="text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="font-mono text-sm text-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-foreground/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="audience"
        className="grid gap-8 rounded-lg border border-foreground/10 p-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-3">
          <h2 id="audience" className="text-xl font-semibold tracking-tight">
            Built for teams running AI in production
          </h2>
          <ul className="flex flex-col gap-1 text-sm text-foreground/70">
            {AUDIENCES.map((audience) => (
              <li key={audience}>{audience}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Built to be trusted
          </h2>
          <ul className="flex flex-col gap-1 text-sm text-foreground/70">
            {TRUST.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-2 border-t border-foreground/10 pt-6 text-sm text-foreground/60">
        <span>
          {PRODUCT_NAME} 0.1.0 · MIT license · Self-hosted, with no prompt data
          stored
        </span>
        <a href={REPOSITORY_URL} className="underline underline-offset-4">
          Source and documentation
        </a>
      </footer>
    </main>
  );
}
