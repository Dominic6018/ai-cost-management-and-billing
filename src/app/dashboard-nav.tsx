import Link from "next/link";
import type { ReactNode } from "react";
import type { SessionUser } from "@/db/auth";
import { navigationFor } from "@/lib/navigation";
import { PRODUCT_NAME } from "@/lib/product";
import { logoutAction } from "./login/actions";

/** Line icons for the sections, drawn on a 24-unit grid. */
const ICONS: Record<string, ReactNode> = {
  Overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  Usage: <path d="M3 12h4l3-7 4 14 3-7h4" />,
  Insights: <path d="M5 19v-7M10.5 19V5M16 19v-5M21 19V9M3 21h18" />,
  Customers: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.6a6.5 6.5 0 0 1 3.5 5.4" />
    </>
  ),
  Budgets: <path d="M4 18a8 8 0 1 1 16 0M12 18l4-5" />,
  Prices: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8.5 8.5-9 9z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  Integrations: (
    <path d="M9 2.5V8M15 2.5V8M6 8h12v3a6 6 0 0 1-12 0zM12 17v4.5" />
  ),
  Team: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />,
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
    >
      {ICONS[name]}
    </svg>
  );
}

/** The brand: a meter in the accent colour, then the name. */
export function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7 shrink-0">
        <rect width="28" height="28" rx="7" className="fill-accent" />
        <path
          d="M7.5 18.5a6.5 6.5 0 0 1 13 0M14 18.5l3.5-4"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        {PRODUCT_NAME}
      </span>
    </span>
  );
}

const ROLE_LABELS: Record<SessionUser["role"], string> = {
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

/**
 * The sidebar on every dashboard page: the brand, the sections with the
 * current section's pages beneath it, and the account with a way to sign
 * out. On small screens it folds into a top bar with a menu toggle that
 * works without JavaScript.
 */
export function DashboardNav({
  user,
  current,
}: {
  user: SessionUser;
  /** The page's path, e.g. "/spend", to mark where the account is. */
  current: string;
}) {
  const sections = navigationFor(user, current);
  return (
    <aside
      className="flex flex-col border-b border-foreground/10 bg-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0"
      data-testid="dashboard-nav"
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-5 lg:pt-6 lg:pb-5">
        <Link href="/" aria-label={`${PRODUCT_NAME} home`}>
          <BrandMark />
        </Link>
        <label
          htmlFor="dashboard-menu"
          className="cursor-pointer rounded-md border border-foreground/15 px-3 py-1.5 text-sm lg:hidden"
        >
          Menu
        </label>
      </div>
      <input
        id="dashboard-menu"
        type="checkbox"
        className="peer sr-only"
        aria-label="Show the menu"
      />
      <div className="hidden min-h-0 flex-1 flex-col peer-checked:flex lg:flex">
        <nav
          aria-label="Sections"
          className="flex-1 overflow-y-auto px-3 pb-4 text-sm"
        >
          <ul className="flex flex-col gap-0.5">
            {sections.map((section) => (
              <li key={section.label}>
                <div className="relative">
                  <Link
                    href={section.links[0].href}
                    aria-current={section.active ? "page" : undefined}
                    className={`block rounded-md py-2 pr-3 pl-9 transition-colors ${
                      section.active
                        ? "bg-foreground/[0.06] font-medium text-foreground"
                        : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </Link>
                  <span
                    className={
                      section.active ? "text-accent" : "text-foreground/50"
                    }
                  >
                    <Icon name={section.label} />
                  </span>
                </div>
                {section.active && section.links.length > 1 && (
                  <ul
                    aria-label={section.label}
                    className="mt-0.5 mb-1 ml-[1.4rem] flex flex-col gap-0.5 border-l border-foreground/10 pl-3"
                  >
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={
                            link.href === current ? "page" : undefined
                          }
                          className={`block rounded-md px-2.5 py-1.5 ${
                            link.href === current
                              ? "font-medium text-accent"
                              : "text-foreground/60 hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <form
          action={logoutAction}
          className="flex items-center gap-3 border-t border-foreground/10 px-4 py-4"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent uppercase"
          >
            {user.email.charAt(0)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm" title={user.email}>
              {user.email}
            </span>
            <span className="text-xs text-foreground/60">
              {ROLE_LABELS[user.role]}
            </span>
          </span>
          <button
            type="submit"
            className="rounded-md px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
