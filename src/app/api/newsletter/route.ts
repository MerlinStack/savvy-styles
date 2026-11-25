import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const schema = z.object({
  email: z.email("Enter a valid email address.").max(254),
  source: z.string().max(60).optional(),
  /** Honeypot — real submissions leave this empty. */
  website: z.string().max(200).optional(),
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
        code: "INVALID_EMAIL",
        message: "Enter a valid email address.",
      },
      { status: 422 },
    );
  }

  // Silently accept bot submissions so the honeypot is not revealed.
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  const devStoreEnabled =
    process.env.NEWSLETTER_DEV_STORE === "true" ||
    process.env.NODE_ENV !== "production";

  if (!devStoreEnabled) {
    // A transactional email/provider integration is required for production.
    return Response.json(
      {
        ok: false,
        code: "NEWSLETTER_NOT_CONFIGURED",
        message:
          "Newsletter subscriptions are not enabled yet. Please follow @savvystyle.ng for updates.",
      },
      { status: 503 },
    );
  }

  try {
    const dataDirectory = path.join(process.cwd(), ".data");
    await mkdir(dataDirectory, { recursive: true });
    await appendFile(
      path.join(dataDirectory, "newsletter.ndjson"),
      `${JSON.stringify({
        id: crypto.randomUUID(),
        email: parsed.data.email.trim().toLowerCase(),
        source: parsed.data.source ?? "site",
        createdAt: new Date().toISOString(),
      })}\n`,
      "utf8",
    );

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        ok: false,
        code: "STORE_UNAVAILABLE",
        message: "We could not save your email. Please try again.",
      },
      { status: 500 },
    );
  }
}
