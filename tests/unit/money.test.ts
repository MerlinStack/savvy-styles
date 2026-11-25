import { describe, expect, it } from "vitest";
import {
  CURRENCY_DEFINITIONS,
  convertNgnKobo,
  formatMinorUnits,
  formatPrice,
  getIndicativeRates,
  isCurrencyCode,
  koboToNaira,
  nairaToKobo,
  type ExchangeRates,
} from "@/modules/money";

const FLAT_RATES: ExchangeRates = {
  NGN: 1,
  USD: 1_000,
  GBP: 1_000,
  EUR: 1_000,
};

describe("nairaToKobo", () => {
  it("converts whole naira to kobo", () => {
    expect(nairaToKobo(185_000)).toBe(18_500_000);
  });

  it("rounds fractional naira to the nearest kobo", () => {
    expect(nairaToKobo(0.1 + 0.2)).toBe(30);
    expect(nairaToKobo(1.004)).toBe(100);
    expect(nairaToKobo(1.006)).toBe(101);
  });

  it("accepts zero", () => {
    expect(nairaToKobo(0)).toBe(0);
  });

  it("rejects negative, infinite and NaN amounts", () => {
    expect(() => nairaToKobo(-1)).toThrow(RangeError);
    expect(() => nairaToKobo(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => nairaToKobo(Number.NaN)).toThrow(RangeError);
  });
});

describe("koboToNaira", () => {
  it("converts kobo back to naira", () => {
    expect(koboToNaira(18_500_000)).toBe(185_000);
    expect(koboToNaira(12_345)).toBe(123.45);
  });

  it("rejects fractional kobo and negatives", () => {
    expect(() => koboToNaira(1.5)).toThrow(RangeError);
    expect(() => koboToNaira(-100)).toThrow(RangeError);
  });
});

describe("convertNgnKobo", () => {
  it("returns the same amount for NGN", () => {
    expect(convertNgnKobo(18_500_000, "NGN")).toBe(18_500_000);
  });

  it("converts using the supplied NGN-per-unit rate", () => {
    // ₦1,000 = 100,000 kobo → 1 USD at 1,000 NGN/USD → 100 cents.
    expect(convertNgnKobo(100_000, "USD", FLAT_RATES)).toBe(100);
  });

  it("rounds display amounts to whole units", () => {
    // ₦185,000 at 1,550 = 119.35 USD → 119 USD → 11,900 cents.
    expect(convertNgnKobo(18_500_000, "USD")).toBe(11_900);
    // ₦185,000 at 1,980 = 93.43 GBP → 93 GBP → 9,300 pence.
    expect(convertNgnKobo(18_500_000, "GBP")).toBe(9_300);
  });

  it("rejects a non-integer kobo amount", () => {
    expect(() => convertNgnKobo(100.5, "USD", FLAT_RATES)).toThrow(RangeError);
  });

  it("rejects a missing or invalid rate", () => {
    expect(() =>
      convertNgnKobo(100_000, "USD", { ...FLAT_RATES, USD: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      convertNgnKobo(100_000, "USD", { ...FLAT_RATES, USD: Number.NaN }),
    ).toThrow(RangeError);
  });
});

describe("formatting", () => {
  it("formats NGN without decimals", () => {
    const formatted = formatMinorUnits(18_500_000, "NGN").replace(/\u00a0/g, " ");
    expect(formatted).toContain("185,000");
    expect(formatted).not.toContain(".00");
  });

  it("formats USD as whole dollars", () => {
    expect(formatMinorUnits(11_900, "USD")).toBe("$119");
  });

  it("formats converted catalogue prices", () => {
    expect(formatPrice(18_500_000, "USD")).toBe("$119");
    expect(formatPrice(18_500_000, "GBP")).toContain("93");
    expect(formatPrice(18_500_000, "EUR")).toContain("109");
  });

  it("keeps NGN authoritative regardless of the display currency", () => {
    expect(formatPrice(18_500_000, "NGN")).toBe(
      formatMinorUnits(18_500_000, "NGN"),
    );
  });
});

describe("currency metadata", () => {
  it("only marks NGN as payment-supported", () => {
    const supported = Object.values(CURRENCY_DEFINITIONS).filter(
      (definition) => definition.paymentSupported,
    );
    expect(supported.map((definition) => definition.code)).toEqual(["NGN"]);
  });

  it("exposes indicative rates for every supported display currency", () => {
    const rates = getIndicativeRates();
    expect(Object.keys(rates).sort()).toEqual(["EUR", "GBP", "NGN", "USD"]);
    expect(rates.NGN).toBe(1);
    expect(rates.USD).toBeGreaterThan(0);
  });

  it("narrows currency codes", () => {
    expect(isCurrencyCode("NGN")).toBe(true);
    expect(isCurrencyCode("ngn")).toBe(false);
    expect(isCurrencyCode("JPY")).toBe(false);
  });
});
