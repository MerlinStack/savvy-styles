export type ShippingZone = "lagos" | "nigeria" | "international";

export interface ShippingRate {
  zone: ShippingZone;
  label: string;
  amountKobo: number;
  estimate: string;
  /** Sample configuration pending owner-approved courier pricing. */
  isSample: boolean;
}

/**
 * SAMPLE SHIPPING RATES — NOT OWNER-APPROVED PRICING.
 * These values exist to exercise the checkout calculation and must be
 * replaced by administrator-configured rates before launch.
 */
export const SHIPPING_RATES: Record<ShippingZone, ShippingRate> = {
  lagos: {
    zone: "lagos",
    label: "Lagos delivery",
    amountKobo: 350_000,
    estimate: "1–2 business days",
    isSample: true,
  },
  nigeria: {
    zone: "nigeria",
    label: "Nationwide delivery",
    amountKobo: 650_000,
    estimate: "2–4 business days",
    isSample: true,
  },
  international: {
    zone: "international",
    label: "International delivery",
    amountKobo: 4_500_000,
    estimate: "7–14 business days",
    isSample: true,
  },
};

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT — Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export function resolveShippingZone(
  countryCode: string,
  state?: string,
): ShippingZone {
  const country = (countryCode || "NG").trim().toUpperCase();
  if (country !== "NG") return "international";
  const normalisedState = (state ?? "").trim().toLowerCase();
  if (normalisedState === "lagos" || normalisedState.includes("lagos")) {
    return "lagos";
  }
  return "nigeria";
}

export function getShippingRate(
  countryCode: string,
  state?: string,
): ShippingRate {
  return SHIPPING_RATES[resolveShippingZone(countryCode, state)];
}

export const INTERNATIONAL_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "IE", name: "Ireland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "PT", name: "Portugal" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "AU", name: "Australia" },
] as const;
