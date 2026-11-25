"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartItemCount } from "@/modules/cart/store";
import { summarizeCart } from "@/modules/cart/totals";
import { getAllProducts } from "@/modules/catalogue/queries";
import { useHydrated } from "@/lib/use-hydrated";
import { ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";

export function CartPageContent() {
  const hydrated = useHydrated();
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  const summary = summarizeCart(lines, getAllProducts());
  const count = cartItemCount(lines);

  return (
    <div className="container-luxe py-10 lg:py-16">
      <p className="eyebrow text-gold-deep">Your selection</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-page-title">
          Your <em className="italic text-gold-deep">bag</em>.
        </h1>
        <p className="pb-2 text-[0.62rem] uppercase tracking-[0.18em] text-stone">
          {hydrated
            ? `${count} ${count === 1 ? "item" : "items"}`
            : "Loading your bag"}
        </p>
      </div>

      {!hydrated ? (
        <CartSkeleton />
      ) : summary.lines.length === 0 ? (
        <div className="mt-10 border-y border-line py-16 sm:py-24">
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-3xl leading-tight sm:text-4xl">
              Nothing here yet.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/55">
              Your bag is empty. Browse the current edit to find a pair, or
              start with what is ready to dispatch.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/shop">Browse the collection</ButtonLink>
              <ButtonLink href="/ready-stock" variant="secondary">
                Ready stock
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ul className="border-t border-line">
              {summary.lines.map((line) => (
                <li
                  key={line.variant.id}
                  className="grid grid-cols-[5.75rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
                >
                  <Link
                    href={`/product/${line.product.slug}`}
                    className="relative block aspect-[4/5] overflow-hidden bg-sand"
                  >
                    <Image
                      src={line.product.images[0].src}
                      alt={line.product.images[0].alt}
                      fill
                      sizes="120px"
                      className="object-cover"
                      style={{
                        objectPosition:
                          line.product.images[0].position ?? "center",
                      }}
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-display text-xl leading-tight">
                          <Link
                            href={`/product/${line.product.slug}`}
                            className="link-underline"
                          >
                            {line.product.name}
                          </Link>
                        </h2>
                        <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-stone">
                          {line.variant.colour} · Size {line.variant.size}
                        </p>
                        {!line.available ? (
                          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.12em] text-gold-deep">
                            Availability changed — remove to continue
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(line.variant.id)}
                        className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-ink"
                        aria-label={`Remove ${line.product.name} size ${line.variant.size}`}
                      >
                        <X
                          aria-hidden="true"
                          strokeWidth={1.4}
                          className="size-4"
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.variant.id, line.quantity - 1)
                          }
                          className="inline-flex size-9 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink"
                          aria-label={`Decrease quantity of ${line.product.name}`}
                        >
                          <Minus
                            aria-hidden="true"
                            className="size-3"
                            strokeWidth={1.5}
                          />
                        </button>
                        <span
                          className="w-8 text-center text-[0.72rem] tabular-nums"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.variant.id, line.quantity + 1)
                          }
                          className="inline-flex size-9 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink"
                          aria-label={`Increase quantity of ${line.product.name}`}
                        >
                          <Plus
                            aria-hidden="true"
                            className="size-3"
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>

                      <Price
                        amountKobo={line.lineTotalKobo}
                        className="text-[0.9rem]"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <Link href="/shop" className="eyebrow link-underline text-ink">
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-[0.62rem] uppercase tracking-[0.14em] text-stone transition-colors hover:text-ink"
              >
                Clear bag
              </button>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border border-line bg-paper p-5 sm:p-6">
              <h2 className="font-display text-2xl">Summary</h2>

              <dl className="mt-5 space-y-3 border-t border-line pt-4 text-[0.82rem]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd>
                    <Price amountKobo={summary.subtotalKobo} />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink/60">Shipping</dt>
                  <dd className="text-[0.72rem] text-stone">
                    Calculated at checkout
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink/60">
                  Total
                </span>
                <Price amountKobo={summary.subtotalKobo} className="text-base" />
              </div>

              {summary.hasIssues ? (
                <p
                  role="alert"
                  className="mt-4 border border-gold-deep/30 bg-gold/10 px-3 py-2 text-[0.72rem] leading-relaxed text-gold-deep"
                >
                  One or more pieces changed availability. Remove them to
                  continue to checkout.
                </p>
              ) : null}

              <ButtonLink
                href="/checkout"
                className={
                  summary.hasIssues
                    ? "pointer-events-none mt-5 w-full opacity-40"
                    : "mt-5 w-full"
                }
                aria-disabled={summary.hasIssues}
              >
                Continue to checkout
              </ButtonLink>

              <p className="mt-3 text-[0.68rem] leading-relaxed text-ink/45">
                Payment settles in Naira. Other display currencies are
                indicative.
              </p>
            </div>

            <div className="mt-4 border border-line p-5">
              <p className="eyebrow text-stone">Delivery</p>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-ink/50">
                Lagos, nationwide and international zones. Shipping is
                calculated by destination at checkout; this preview uses sample
                rates pending owner-approved pricing.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-12" aria-busy="true">
      <div className="space-y-6 lg:col-span-7">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[5.75rem_1fr] gap-4">
            <div className="aspect-[4/5] animate-pulse bg-sand" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-1/2 animate-pulse bg-sand" />
              <div className="h-2.5 w-1/3 animate-pulse bg-sand/70" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 animate-pulse border border-line bg-sand/40 lg:col-span-4 lg:col-start-9" />
    </div>
  );
}
