import { describe, expect, it } from "vitest";
import { currencyForCountry } from "@/modules/currency/detect";

describe("currencyForCountry", () => {
  it("maps Nigeria to NGN", () => {
    expect(currencyForCountry("NG")).toBe("NGN");
    expect(currencyForCountry("ng")).toBe("NGN");
  });

  it("maps the United States and United Kingdom", () => {
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("GB")).toBe("GBP");
  });

  it("maps eurozone members to EUR", () => {
    for (const code of ["DE", "FR", "IE", "IT", "ES", "NL", "PT"]) {
      expect(currencyForCountry(code)).toBe("EUR");
    }
  });

  it("falls back to NGN for non-euro Europe and unknown countries", () => {
    expect(currencyForCountry("SE")).toBe("NGN");
    expect(currencyForCountry("PL")).toBe("NGN");
    expect(currencyForCountry("JP")).toBe("NGN");
  });

  it("falls back to NGN when no country is known", () => {
    expect(currencyForCountry(null)).toBe("NGN");
    expect(currencyForCountry(undefined)).toBe("NGN");
    expect(currencyForCountry("")).toBe("NGN");
    expect(currencyForCountry("  ")).toBe("NGN");
  });

  it("trims surrounding whitespace", () => {
    expect(currencyForCountry(" us ")).toBe("USD");
  });
});
