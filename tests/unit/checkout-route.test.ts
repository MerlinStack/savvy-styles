import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";
import { getProductBySlug } from "@/modules/catalogue/queries";

const regent = getProductBySlug("regent-court-low");
const aeon = getProductBySlug("aeon-runner");
if (!regent || !aeon) throw new Error("Missing checkout fixtures");

const regent41 = regent.variants.find((variant) => variant.size === "41");
const aeon42 = aeon.variants.find((variant) => variant.size === "42");
if (!regent41 || !aeon42) throw new Error("Missing checkout variants");

const payload = (overrides: Record<string, unknown> = {}) => ({
    customer: {
      firstName: "Ada",
      lastName: "Okafor",
      email: "ada@example.com",
      phone: "+2348000000000",
    },
    address: {
      country: "NG",
      state: "Lagos",
      city: "Lagos",
      line1: "1 Test Street",
    },
    lines: [
      { productId: regent.id, variantId: regent41.id, quantity: 2 },
    ],
    displayCurrency: "NGN",
    acceptedPolicy: true,
    ...overrides,
  });

function request(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function json(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

function normalise(value: unknown): string {
  return String(value).replace(/\u00a0/g, " ");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/checkout", () => {
  it("rejects malformed JSON without touching pricing", async () => {
    const response = await POST(request("{not json"));
    expect(response.status).toBe(400);
    expect(await json(response)).toMatchObject({ code: "INVALID_JSON" });
  });

  it("validates the delivery details", async () => {
    const response = await POST(
      request(payload({ customer: { firstName: "", lastName: "" } })),
    );
    expect(response.status).toBe(422);
    expect(await json(response)).toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("rejects an empty bag after resolving catalogue lines", async () => {
    const response = await POST(
      request(
        payload({
          lines: [{ productId: "nope", variantId: "nope", quantity: 1 }],
        }),
      ),
    );
    expect(response.status).toBe(400);
    expect(await json(response)).toMatchObject({ code: "EMPTY_BAG" });
  });

  it("rejects lines that exceed stock", async () => {
    const response = await POST(
      request(
        payload({
          lines: [{ productId: regent.id, variantId: regent41.id, quantity: 5 }],
        }),
      ),
    );
    expect(response.status).toBe(409);
    expect(await json(response)).toMatchObject({ code: "UNAVAILABLE_LINES" });
  });

  it("prices from the catalogue and refuses to take payment while unconfigured", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");

    const response = await POST(
      request(
        payload({
          // A hostile client-supplied total must be ignored.
          totalKobo: 1,
          subtotalKobo: 1,
        }),
      ),
    );

    expect(response.status).toBe(503);
    const body = await json(response);
    expect(body.code).toBe("PAYMENT_NOT_CONFIGURED");
    expect(body.missing).toEqual(["DATABASE_URL", "PAYSTACK_SECRET_KEY"]);

    const preview = body.preview as Record<string, unknown>;
    expect(preview.itemCount).toBe(2);
    expect(normalise(preview.subtotal)).toContain("370,000");
    expect(normalise(preview.shipping)).toContain("3,500");
    expect(normalise(preview.total)).toContain("373,500");
    expect(preview.chargeCurrency).toBe("NGN");
    expect(preview.displayCurrency).toBe("NGN");
  });

  it("uses the international zone for a non-Nigerian address", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");

    const response = await POST(
      request(
        payload({
          address: {
            country: "US",
            state: "New York",
            city: "New York",
            line1: "1 Test Street",
          },
        }),
      ),
    );

    const preview = (await json(response)).preview as Record<string, unknown>;
    expect(normalise(preview.shipping)).toContain("45,000");
    expect(preview.shippingLabel).toBe("International delivery");
  });

  it("prices a pre-order reservation at the catalogue price", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");

    const response = await POST(
      request(
        payload({
          lines: [{ productId: aeon.id, variantId: aeon42.id, quantity: 1 }],
        }),
      ),
    );

    const preview = (await json(response)).preview as Record<string, unknown>;
    expect(preview.itemCount).toBe(1);
    expect(normalise(preview.subtotal)).toContain("160,000");
    expect(normalise(preview.total)).toContain("163,500");
  });
});
