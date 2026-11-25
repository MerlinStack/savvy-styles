"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/modules/cart/store";
import { summarizeCart } from "@/modules/cart/totals";
import { getAllProducts } from "@/modules/catalogue/queries";
import {
  getShippingRate,
  INTERNATIONAL_COUNTRIES,
  NIGERIAN_STATES,
} from "@/modules/shipping";
import { useCurrencyStore } from "@/modules/currency/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Button, ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";

interface CheckoutPreview {
  itemCount: number;
  subtotal: string;
  shipping: string;
  shippingLabel: string;
  total: string;
  chargeCurrency: string;
  displayCurrency: string;
}

type Status = "idle" | "submitting" | "error" | "notice";

const inputClass =
  "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-[0.85rem] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink";

const labelClass =
  "block text-[0.58rem] font-medium uppercase tracking-[0.18em] text-stone";

export function CheckoutForm() {
  const hydrated = useHydrated();
  const lines = useCartStore((state) => state.lines);
  const displayCurrency = useCurrencyStore((state) => state.currency);

  const [country, setCountry] = useState("NG");
  const [state, setState] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);

  const summary = useMemo(
    () => summarizeCart(lines, getAllProducts()),
    [lines],
  );
  const shipping = getShippingRate(country, state);

  if (!hydrated) {
    return <CheckoutSkeleton />;
  }

  if (summary.lines.length === 0) {
    return (
      <div className="container-luxe py-10 lg:py-16">
        <p className="eyebrow text-gold-deep">Checkout</p>
        <h1 className="text-page-title mt-4">Your bag is empty.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">
          Add a piece to the bag before starting checkout.
        </p>
        <ButtonLink href="/shop" className="mt-7">
          Browse the collection
        </ButtonLink>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const value = (key: string) => String(formData.get(key) ?? "").trim();

    setStatus("submitting");
    setMessage("");
    setPreview(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: value("firstName"),
            lastName: value("lastName"),
            email: value("email"),
            phone: value("phone"),
          },
          address: {
            country: value("country"),
            state: value("state") || undefined,
            city: value("city"),
            line1: value("line1"),
            line2: value("line2") || undefined,
            postalCode: value("postalCode") || undefined,
            instructions: value("instructions") || undefined,
          },
          lines: summary.lines.map((line) => ({
            productId: line.product.id,
            variantId: line.variant.id,
            quantity: line.quantity,
          })),
          displayCurrency,
          acceptedPolicy: true,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        code?: string;
        message?: string;
        preview?: CheckoutPreview;
      };

      if (data.preview) setPreview(data.preview);

      if (response.ok && data.ok) {
        setStatus("notice");
        setMessage("The order was accepted by the server.");
        return;
      }

      setStatus("error");
      setMessage(
        data.message ??
          "Checkout could not be completed. No payment has been taken.",
      );
    } catch {
      setStatus("error");
      setMessage(
        "The connection failed. No payment has been taken. Please try again.",
      );
    }
  }

  return (
    <div className="container-luxe py-10 lg:py-16">
      <p className="eyebrow text-gold-deep">Checkout</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
        <h1 className="text-page-title lg:col-span-7">
          Complete the{" "}
          <em className="italic text-gold-deep">order</em>.
        </h1>
        <p className="max-w-sm text-[0.82rem] leading-relaxed text-ink/55 lg:col-span-4 lg:col-start-9 lg:pb-2">
          Delivery details first. Payment is handled securely at the final step
          once the payment provider is configured.
        </p>
      </div>

      <div className="mt-6 border border-gold-deep/25 bg-gold/8 px-4 py-3 text-[0.72rem] leading-relaxed text-gold-deep">
        <span className="font-medium uppercase tracking-[0.16em]">
          Preview build.
        </span>{" "}
        Payment is not enabled in this environment. You can review delivery and
        totals, but no payment will be taken and no order will be created.
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8"
      >
        <div className="space-y-10 lg:col-span-7">
          <fieldset>
            <legend className="font-display text-2xl">Contact</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">Delivery</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  autoComplete="country"
                  value={country}
                  onChange={(event) => {
                    setCountry(event.target.value);
                    setState("");
                  }}
                  className={inputClass}
                >
                  <option value="NG">Nigeria</option>
                  {INTERNATIONAL_COUNTRIES.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="state" className={labelClass}>
                  {country === "NG" ? "State" : "State / region"}
                </label>
                {country === "NG" ? (
                  <select
                    id="state"
                    name="state"
                    required
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a state</option>
                    {NIGERIAN_STATES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className={inputClass}
                  />
                )}
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className={labelClass}>
                  Postal code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="line1" className={labelClass}>
                  Address
                </label>
                <input
                  id="line1"
                  name="line1"
                  required
                  autoComplete="address-line1"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="line2" className={labelClass}>
                  Apartment, suite or landmark (optional)
                </label>
                <input
                  id="line2"
                  name="line2"
                  autoComplete="address-line2"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="instructions" className={labelClass}>
                  Delivery notes (optional)
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          <div className="border-t border-line pt-6">
            <label className="flex cursor-pointer items-start gap-3 text-[0.78rem] leading-relaxed text-ink/60">
              <input
                type="checkbox"
                required
                className="mt-0.5 size-4 shrink-0 accent-ink"
              />
              <span>
                I confirm the delivery details above. I understand this preview
                build will not take payment or create an order.
              </span>
            </label>
          </div>

          {message ? (
            <p
              role="status"
              aria-live="polite"
              className={
                status === "error"
                  ? "border border-gold-deep/30 bg-gold/10 px-4 py-3 text-[0.78rem] leading-relaxed text-gold-deep"
                  : "border border-line bg-paper px-4 py-3 text-[0.78rem] leading-relaxed text-ink/65"
              }
            >
              {message}
            </p>
          ) : null}

          {preview ? (
            <div className="border border-line bg-paper p-5">
              <p className="eyebrow text-stone">Order review · no payment taken</p>
              <dl className="mt-4 space-y-2 text-[0.8rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Items</dt>
                  <dd className="tabular-nums">{preview.itemCount}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Subtotal</dt>
                  <dd>{preview.subtotal}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">{preview.shippingLabel}</dt>
                  <dd>{preview.shipping}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2">
                  <dt className="text-ink">Total</dt>
                  <dd>{preview.total}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[0.68rem] text-ink/45">
                Charged in {preview.chargeCurrency}. Displayed in{" "}
                {preview.displayCurrency}.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  Reviewing
                </>
              ) : (
                "Review checkout"
              )}
            </Button>
            <ButtonLink href="/cart" variant="secondary" className="w-full sm:w-auto">
              Back to bag
            </ButtonLink>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border border-line bg-paper p-5 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Your order</h2>

            <ul className="mt-4 divide-y divide-line border-y border-line">
              {summary.lines.map((line) => (
                <li
                  key={line.variant.id}
                  className="flex gap-3 py-3.5"
                >
                  <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-sand">
                    <Image
                      src={line.product.images[0].src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{
                        objectPosition:
                          line.product.images[0].position ?? "center",
                      }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.95rem] leading-tight">
                      {line.product.name}
                    </span>
                    <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.12em] text-stone">
                      Size {line.variant.size} · Qty {line.quantity}
                    </span>
                  </span>
                  <Price
                    amountKobo={line.lineTotalKobo}
                    className="shrink-0 text-[0.72rem] text-ink/70"
                  />
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 text-[0.8rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink/55">Subtotal</dt>
                <dd>
                  <Price amountKobo={summary.subtotalKobo} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink/55">
                  {shipping.label}
                  {shipping.isSample ? (
                    <span className="ml-1.5 text-[0.58rem] uppercase tracking-[0.1em] text-gold-deep">
                      Sample
                    </span>
                  ) : null}
                </dt>
                <dd>
                  <Price amountKobo={shipping.amountKobo} />
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-line pt-2.5">
                <dt className="text-[0.62rem] uppercase tracking-[0.16em] text-ink/60">
                  Total
                </dt>
                <dd className="text-sm">
                  <Price
                    amountKobo={summary.subtotalKobo + shipping.amountKobo}
                  />
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[0.66rem] leading-relaxed text-ink/45">
              {shipping.estimate} · sample window. Payment settles in Naira;
              other display currencies are indicative. Duties and taxes, if any,
              are not included here.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="container-luxe py-10 lg:py-16" aria-busy="true">
      <div className="h-2.5 w-24 animate-pulse bg-sand" />
      <div className="mt-5 h-12 w-2/3 animate-pulse bg-sand" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse bg-sand/60" />
          ))}
        </div>
        <div className="h-72 animate-pulse bg-sand/50 lg:col-span-4 lg:col-start-9" />
      </div>
    </div>
  );
}
