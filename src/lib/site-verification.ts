/**
 * Google Search Console's ownership check: a `google-site-verification`
 * meta tag on the site's pages. GOOGLE_SITE_VERIFICATION holds its code,
 * or the whole tag as Search Console shows it, from which the code is
 * taken. Anything else is ignored, so a mistake never breaks a page.
 */

/** Google's codes are URL-safe base64; this also bounds their length. */
const CODE = /^[A-Za-z0-9_-]{10,100}$/;

/** The verification code in `value`, or undefined if there's none. */
export function parseSiteVerification(
  value: string | undefined,
): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  // The whole tag: <meta name="google-site-verification" content="..." />
  const fromTag = /\bcontent\s*=\s*["']([^"']*)["']/i.exec(text)?.[1];
  const code = (fromTag ?? text).trim();
  return CODE.test(code) ? code : undefined;
}
