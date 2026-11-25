import { headers } from "next/headers";
import { currencyForCountry } from "@/modules/currency/detect";

/**
 * Uses edge-provided country headers (Vercel / Cloudflare). No external IP
 * lookup is performed, so no visitor IP leaves the application. When no header
 * exists (local development), the safe default is NGN.
 */
export async function GET() {
  const requestHeaders = await headers();
  const country =
    requestHeaders.get("x-vercel-ip-country") ??
    requestHeaders.get("cf-ipcountry") ??
    requestHeaders.get("x-country-code");

  return Response.json(
    {
      country: country?.toUpperCase() ?? null,
      currency: currencyForCountry(country),
      source: country ? "edge-headers" : "fallback",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
