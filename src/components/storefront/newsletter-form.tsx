"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

interface NewsletterFormProps {
  tone?: "light" | "dark";
  source?: string;
  className?: string;
}

export function NewsletterForm({
  tone = "light",
  source = "site",
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const dark = tone === "dark";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const honeypot = new FormData(form).get("website");

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: honeypot ?? "" }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(
          data.message ?? "We could not save your email. Please try again.",
        );
        return;
      }

      setStatus("success");
      setMessage("You are on the list. Notes will arrive occasionally.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("The connection failed. Please try again.");
    }
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} noValidate={false}>
        <div
          className={cn(
            "flex items-center gap-3 border-b pb-3",
            dark ? "border-paper/25" : "border-ink/25",
          )}
        >
          <label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${source}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="Email address"
            aria-describedby={`newsletter-status-${source}`}
            className={cn(
              "min-w-0 flex-1 bg-transparent py-2 text-sm outline-none",
              dark
                ? "text-paper placeholder:text-paper/40"
                : "text-ink placeholder:text-stone",
            )}
          />
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor={`newsletter-website-${source}`}>
              Leave this field empty
            </label>
            <input
              id={`newsletter-website-${source}`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center transition-colors disabled:opacity-50",
              dark
                ? "text-paper hover:bg-paper hover:text-ink"
                : "text-ink hover:bg-ink hover:text-paper",
            )}
            aria-label="Subscribe to notes from Savvy Style"
          >
            {status === "submitting" ? (
              <Loader2
                aria-hidden="true"
                className="size-4 animate-spin"
                strokeWidth={1.5}
              />
            ) : (
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.4}
              />
            )}
          </button>
        </div>

        <p
          id={`newsletter-status-${source}`}
          role="status"
          aria-live="polite"
          className={cn(
            "mt-3 min-h-5 text-[0.72rem] leading-relaxed",
            status === "error"
              ? "text-gold-deep"
              : dark
                ? "text-paper/55"
                : "text-ink/55",
          )}
        >
          {message ||
            "Occasional notes on new arrivals and pre-order windows. No noise."}
        </p>
      </form>
    </div>
  );
}
