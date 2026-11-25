"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-[0.85rem] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink";

const labelClass =
  "block text-[0.58rem] font-medium uppercase tracking-[0.18em] text-stone";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const value = (key: string) => String(formData.get(key) ?? "").trim();

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          orderReference: value("orderReference") || undefined,
          message: value("message"),
          website: value("website"),
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "The message could not be sent.");
        return;
      }

      setStatus("success");
      setMessage(
        "Your message has been recorded. Direct replies require the house's contact details, which are still being confirmed.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("The connection failed. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-reference" className={labelClass}>
          Order reference (optional)
        </label>
        <input
          id="contact-reference"
          name="orderReference"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder="Sizing, a pre-order, an order already placed…"
          className={inputClass}
        />
      </div>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className={
          status === "error"
            ? "border border-gold-deep/30 bg-gold/10 px-4 py-3 text-[0.76rem] leading-relaxed text-gold-deep"
            : status === "success"
              ? "border border-line bg-paper px-4 py-3 text-[0.76rem] leading-relaxed text-ink/65"
              : "min-h-5 text-[0.7rem] text-ink/40"
        }
      >
        {message || "Messages are recorded in this preview build."}
      </p>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 w-full sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
              strokeWidth={1.5}
            />
            Sending
          </>
        ) : (
          "Send the message"
        )}
      </Button>
    </form>
  );
}
