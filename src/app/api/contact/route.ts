import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.email("Enter a valid email address.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more.")
    .max(2000),
  orderReference: z.string().trim().max(60).optional(),
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
        code: "VALIDATION_ERROR",
        message: "Check the form and try again.",
      },
      { status: 422 },
    );
  }

  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  const devStoreEnabled =
    process.env.CONTACT_DEV_STORE === "true" ||
    process.env.NODE_ENV !== "production";

  if (!devStoreEnabled) {
    return Response.json(
      {
        ok: false,
        code: "CONTACT_NOT_CONFIGURED",
        message:
          "Messages are not being delivered yet. Please try again once the house confirms its contact details.",
      },
      { status: 503 },
    );
  }

  try {
    const dataDirectory = path.join(process.cwd(), ".data");
    await mkdir(dataDirectory, { recursive: true });
    await appendFile(
      path.join(dataDirectory, "contact.ndjson"),
      `${JSON.stringify({
        id: crypto.randomUUID(),
        name: parsed.data.name,
        email: parsed.data.email.trim().toLowerCase(),
        orderReference: parsed.data.orderReference ?? null,
        message: parsed.data.message,
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
        message: "The message could not be saved. Please try again.",
      },
      { status: 500 },
    );
  }
}
