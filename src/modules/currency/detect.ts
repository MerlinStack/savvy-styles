import type { CurrencyCode } from "@/modules/money";

const EUROZONE = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

/**
 * Approximate display currency from an ISO country code. Payment currency is
 * decided separately and remains NGN until the merchant account is verified
 * for other settlement currencies.
 */
export function currencyForCountry(
  countryCode: string | null | undefined,
): CurrencyCode {
  const code = (countryCode ?? "").trim().toUpperCase();

  if (code === "NG") return "NGN";
  if (code === "US") return "USD";
  if (code === "GB") return "GBP";
  if (EUROZONE.has(code)) return "EUR";
  return "NGN";
}
