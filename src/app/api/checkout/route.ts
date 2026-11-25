import { z } from "zod";
import { summarizeCart } from "@/modules/cart/totals";
import { getAllProducts } from "@/modules/catalogue/queries";
import { formatNgn } from "@/modules/money";
import { getShippingRate } from "@/modules/shipping";

const schema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email().max(254),
    phone: z.string().trim().min(7).max(30),
  }),
  address: z.object({
    country: z.string().trim().length(2).toUpperCase(),
    state: z.string().trim().max(80).optional(),
    city: z.string().trim().min(1).max(120),
    line1: z.string().trim().min(1).max(200),
    line2: z.string().trim().max(200).optional(),
    postalCode: z.string().trim().max(20).optional(),
    instructions: z.string().trim().max(500).optional(),
  }),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1).max(80),
        variantId: z.string().min(1).max(120),
        quantity: z.number().int().min(1).max(5),
      }),
    )
    .min(1)
    .max(20),
  /** Display preference only. Settlement is NGN until verified otherwise. */
  displayCurrency: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
  acceptedPolicy: z.literal(true),
});

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Check the delivery details and try again.",
      },
      { status: 422 },
    );
  }

  const summary = summarizeCart(parsed.data.lines, getAllProducts());

  if (summary.lines.length === 0) {
    return Response.json(
      { ok: false, code: "EMPTY_BAG" },
      { status: 400 },
    );
  }

  if (summary.hasIssues) {
    return Response.json(
      {
        ok: false,
        code: "UNAVAILABLE_LINES",
        message:
          "One or more items changed availability. Review your bag and try again.",
      },
      { status: 409 },
    );
  }

  const shipping = getShippingRate(
    parsed.data.address.country,
    parsed.data.address.state,
  );
  const totalKobo = summary.subtotalKobo + shipping.amountKobo;

  const missingConfiguration = [
    !process.env.DATABASE_URL ? "DATABASE_URL" : null,
    !process.env.PAYSTACK_SECRET_KEY ? "PAYSTACK_SECRET_KEY" : null,
  ].filter(Boolean);

  const preview = {
    itemCount: summary.itemCount,
    subtotal: formatNgn(summary.subtotalKobo),
    shipping: formatNgn(shipping.amountKobo),
    shippingLabel: shipping.label,
    total: formatNgn(totalKobo),
    chargeCurrency: "NGN",
    displayCurrency: parsed.data.displayCurrency,
  };

  if (missingConfiguration.length > 0) {
    return Response.json(
      {
        ok: false,
        code: "PAYMENT_NOT_CONFIGURED",
        message:
          "Secure payment is not enabled in this environment. No payment has been taken and no order was created.",
        missing: missingConfiguration,
        preview,
      },
      { status: 503 },
    );
  }

  /*
   * The next implementation step is:
   *   1. create the order + stock reservations in one transaction;
   *   2. initialise Paystack server-side with a unique reference;
   *   3. redirect to the provider checkout;
   *   4. confirm only via verified webhook/verify, never the redirect.
   *
   * This branch is intentionally not faked while the order schema and
   * provider adapter are unverified in this environment.
   */
  return Response.json(
    {
      ok: false,
      code: "PAYMENT_ADAPTER_NOT_ENABLED",
      message:
        "Payment initialisation is staged for the next implementation phase. No payment has been taken.",
      preview,
    },
    { status: 503 },
  );
}
