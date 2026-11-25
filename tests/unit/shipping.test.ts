import { describe, expect, it } from "vitest";
import {
  getShippingRate,
  INTERNATIONAL_COUNTRIES,
  NIGERIAN_STATES,
  resolveShippingZone,
  SHIPPING_RATES,
} from "@/modules/shipping";

describe("resolveShippingZone", () => {
  it("routes Lagos addresses to the Lagos zone", () => {
    expect(resolveShippingZone("NG", "Lagos")).toBe("lagos");
    expect(resolveShippingZone("ng", " lagos ")).toBe("lagos");
    expect(resolveShippingZone("NG", "Lagos State")).toBe("lagos");
  });

  it("routes other Nigerian states nationwide", () => {
    expect(resolveShippingZone("NG", "Oyo")).toBe("nigeria");
    expect(resolveShippingZone("NG", "FCT — Abuja")).toBe("nigeria");
  });

  it("defaults a Nigerian address without a state to nationwide", () => {
    expect(resolveShippingZone("NG", undefined)).toBe("nigeria");
    expect(resolveShippingZone("", "")).toBe("nigeria");
  });

  it("routes every non-Nigerian country to international", () => {
    expect(resolveShippingZone("US", "California")).toBe("international");
    expect(resolveShippingZone("GB", "Lagos")).toBe("international");
    expect(resolveShippingZone("gh")).toBe("international");
  });
});

describe("getShippingRate", () => {
  it("returns the configured rate for each zone", () => {
    expect(getShippingRate("NG", "Lagos")).toBe(SHIPPING_RATES.lagos);
    expect(getShippingRate("NG", "Kano")).toBe(SHIPPING_RATES.nigeria);
    expect(getShippingRate("US", "NY")).toBe(SHIPPING_RATES.international);
  });

  it("labels every rate as a development sample", () => {
    for (const rate of Object.values(SHIPPING_RATES)) {
      expect(rate.isSample).toBe(true);
      expect(rate.estimate.length).toBeGreaterThan(0);
    }
  });

  it("prices international above nationwide above Lagos", () => {
    expect(SHIPPING_RATES.lagos.amountKobo).toBeLessThan(
      SHIPPING_RATES.nigeria.amountKobo,
    );
    expect(SHIPPING_RATES.nigeria.amountKobo).toBeLessThan(
      SHIPPING_RATES.international.amountKobo,
    );
  });

  it("stores rates as positive integer kobo", () => {
    for (const rate of Object.values(SHIPPING_RATES)) {
      expect(Number.isInteger(rate.amountKobo)).toBe(true);
      expect(rate.amountKobo).toBeGreaterThan(0);
    }
  });
});

describe("destination data", () => {
  it("lists all 36 states plus the FCT", () => {
    expect(NIGERIAN_STATES).toHaveLength(37);
    expect(new Set(NIGERIAN_STATES).size).toBe(37);
    expect(NIGERIAN_STATES).toContain("Lagos");
    expect(NIGERIAN_STATES).toContain("FCT — Abuja");
  });

  it("lists international destinations with unique ISO codes", () => {
    const codes = INTERNATIONAL_COUNTRIES.map((country) => country.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).not.toContain("NG");
    for (const code of codes) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });
});
