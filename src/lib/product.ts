/**
 * The product's identity, in one place: page titles, headers, the landing
 * page, social sharing and notifications read it from here. Internal
 * identifiers (package names, API paths, environment variables, tables)
 * are unrelated and don't change with it.
 */

/** The brand, shown wherever space is short: headers, tab titles, emails. */
export const PRODUCT_NAME = "MeterVanta";

/** What it is, after the brand: the full title is `${name} — ${descriptor}`. */
export const PRODUCT_DESCRIPTOR =
  "AI Cost Intelligence & Usage-Based Billing Platform";

/** The full product title, for the home page and search results. */
export const PRODUCT_TITLE = `${PRODUCT_NAME} — ${PRODUCT_DESCRIPTOR}`;

export const PRODUCT_CATEGORY = "AI FinOps & Billing Infrastructure";

export const PRODUCT_TAGLINE =
  "Control AI costs. Monetize usage. Protect your margins.";

export const PRODUCT_SECONDARY_TAGLINE =
  "Know what your AI costs. Know what your AI earns.";

/** One or two sentences, for search results and link previews. */
export const PRODUCT_DESCRIPTION =
  "Open-source, self-hosted platform that tracks what every AI API call costs, keeps spend within budget, and bills your customers for their AI usage.";

/** The public repository, for links from the app. */
export const REPOSITORY_URL =
  "https://github.com/Dominic6018/ai-cost-management-and-billing";
