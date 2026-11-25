/**
 * Money is stored as integer minor units. NGN is the canonical currency and
 * `basePriceKobo` values are always NGN kobo (1 naira = 100 kobo).
 */
export const CURRENCY_CODES = ["NGN", "USD", "GBP", "EUR"] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface CurrencyDefinition {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
  /** Indicative development rate. 1 unit of this currency = X NGN. */
  ngnPerUnit: number;
  displayDecimals: number;
  /** Only currencies the merchant can actually settle should be true. */
  paymentSupported: boolean;
}

/**
 * Development fallback rates only. Production rates must come from the
 * configured exchange-rate provider and be cached with a timestamp.
 */
export const CURRENCY_DEFINITIONS: Record<CurrencyCode, CurrencyDefinition> = {
  NGN: {
    code: "NGN",
    label: "Nigerian Naira",
    symbol: "₦",
    locale: "en-NG",
    ngnPerUnit: 1,
    displayDecimals: 0,
    paymentSupported: true,
  },
  USD: {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    locale: "en-US",
    ngnPerUnit: 1_550,
    displayDecimals: 0,
    paymentSupported: false,
  },
  GBP: {
    code: "GBP",
    label: "Pound Sterling",
    symbol: "£",
    locale: "en-GB",
    ngnPerUnit: 1_980,
    displayDecimals: 0,
    paymentSupported: false,
  },
  EUR: {
    code: "EUR",
    label: "Euro",
    symbol: "€",
    locale: "en-IE",
    ngnPerUnit: 1_690,
    displayDecimals: 0,
    paymentSupported: false,
  },
};

export const DEVELOPMENT_RATES_META = {
  isFallback: true,
  updatedAt: "2026-01-01",
  note: "Indicative development rates. Replace with a cached provider feed before launch.",
} as const;

export type ExchangeRates = Record<CurrencyCode, number>;

export function getIndicativeRates(): ExchangeRates {
  return {
    NGN: CURRENCY_DEFINITIONS.NGN.ngnPerUnit,
    USD: CURRENCY_DEFINITIONS.USD.ngnPerUnit,
    GBP: CURRENCY_DEFINITIONS.GBP.ngnPerUnit,
    EUR: CURRENCY_DEFINITIONS.EUR.ngnPerUnit,
  };
}

export function nairaToKobo(naira: number): number {
  if (!Number.isFinite(naira) || naira < 0) {
    throw new RangeError("Naira amount must be a finite, non-negative number.");
  }
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number): number {
  if (!Number.isInteger(kobo) || kobo < 0) {
    throw new RangeError("Kobo amount must be a non-negative integer.");
  }
  return kobo / 100;
}

/**
 * Converts canonical NGN kobo into display minor units for a target currency.
 * The result is rounded to whole display units because catalogue prices are
 * presented without fractional currency. The NGN value remains authoritative.
 */
export function convertNgnKobo(
  amountKobo: number,
  target: CurrencyCode,
  rates: ExchangeRates = getIndicativeRates(),
): number {
  if (!Number.isInteger(amountKobo) || amountKobo < 0) {
    throw new RangeError("NGN amount must be a non-negative integer of kobo.");
  }

  if (target === "NGN") {
    return amountKobo;
  }

  const ngnPerUnit = rates[target];
  if (!Number.isFinite(ngnPerUnit) || ngnPerUnit <= 0) {
    throw new RangeError(`Missing or invalid exchange rate for ${target}.`);
  }

  const targetUnits = amountKobo / 100 / ngnPerUnit;
  const roundedUnits = Math.round(targetUnits);
  return roundedUnits * 100;
}

export function formatMinorUnits(
  amountMinor: number,
  currency: CurrencyCode,
): string {
  const definition = CURRENCY_DEFINITIONS[currency];
  const value = amountMinor / 100;

  return new Intl.NumberFormat(definition.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: definition.displayDecimals,
    maximumFractionDigits: definition.displayDecimals,
  }).format(value);
}

/** Formats a canonical NGN kobo amount in any display currency. */
export function formatPrice(
  amountKobo: number,
  currency: CurrencyCode = "NGN",
  rates: ExchangeRates = getIndicativeRates(),
): string {
  return formatMinorUnits(convertNgnKobo(amountKobo, currency, rates), currency);
}

export function formatNgn(amountKobo: number): string {
  return formatPrice(amountKobo, "NGN");
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return (CURRENCY_CODES as readonly string[]).includes(value);
}
