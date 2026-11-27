import { describe, expect, it } from "vitest";
import { parseSiteVerification } from "./site-verification";

const CODE = "Abc_DEF-1234567890xyzXYZ0987654321abcdEFGHij";

describe("parseSiteVerification", () => {
  it("is off when unset or empty", () => {
    expect(parseSiteVerification(undefined)).toBeUndefined();
    expect(parseSiteVerification("   ")).toBeUndefined();
  });

  it("takes the code, trimmed", () => {
    expect(parseSiteVerification(`  ${CODE}\n`)).toBe(CODE);
  });

  it("takes the code from the whole tag, as Search Console shows it", () => {
    expect(
      parseSiteVerification(
        `<meta name="google-site-verification" content="${CODE}" />`,
      ),
    ).toBe(CODE);
    expect(
      parseSiteVerification(
        `<meta name='google-site-verification' content='${CODE}'>`,
      ),
    ).toBe(CODE);
  });

  it("ignores anything that isn't a code", () => {
    for (const value of [
      "short",
      "has spaces in it, not a code",
      '"><script>alert(1)</script>',
      `<meta name="google-site-verification" content="" />`,
      "x".repeat(101),
    ]) {
      expect(parseSiteVerification(value)).toBeUndefined();
    }
  });
});
