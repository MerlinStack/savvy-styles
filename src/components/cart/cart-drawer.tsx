"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { useUiStore } from "@/modules/ui/store";
import { useCartStore } from "@/modules/cart/store";
import { summarizeCart } from "@/modules/cart/totals";
import { getAllProducts } from "@/modules/catalogue/queries";
import { Price } from "@/components/ui/price";
import { ButtonLink } from "@/components/ui/button";

export function CartDrawer() {
  const open = useUiStore((state) => state.cartOpen);
  const closeCart = useUiStore((state) => state.closeCart);
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useDialog({ open, onClose: closeCart, panelRef });

  const summary = summarizeCart(lines, getAllProducts());

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cart"
          className="fixed inset-0 z-50"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-label="Close bag"
            tabIndex={-1}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col bg-paper outline-none"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-xl">Your bag</h2>
                <span className="text-[0.7rem] tabular-nums text-stone">
                  {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex size-10 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                aria-label="Close bag"
              >
                <X aria-hidden="true" strokeWidth={1.4} className="size-5" />
              </button>
            </div>

            {summary.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-display text-3xl leading-tight">
                  Your bag is quiet.
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">
                  Add a pair to begin, or browse the pieces currently in stock.
                </p>
                <ButtonLink
                  href="/shop"
                  variant="primary"
                  className="mt-7"
                  onClick={closeCart}
                >
                  Browse the collection
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {summary.lines.map((line) => (
                    <li key={line.variant.id} className="flex gap-4 py-5">
                      <Link
                        href={`/product/${line.product.slug}`}
                        onClick={closeCart}
                        className="relative block h-[112px] w-24 shrink-0 overflow-hidden bg-sand"
                      >
                        <Image
                          src={line.product.images[0].src}
                          alt={line.product.images[0].alt}
                          fill
                          sizes="96px"
                          className="object-cover"
                          style={{
                            objectPosition:
                              line.product.images[0].position ?? "center",
                          }}
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/product/${line.product.slug}`}
                              onClick={closeCart}
                              className="link-underline font-display text-[1.05rem] leading-tight"
                            >
                              {line.product.name}
                            </Link>
                            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-stone">
                              {line.variant.colour} · Size {line.variant.size}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(line.variant.id)}
                            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center text-stone transition-colors hover:text-ink"
                            aria-label={`Remove ${line.product.name} size ${line.variant.size} from bag`}
                          >
                            <X
                              aria-hidden="true"
                              strokeWidth={1.4}
                              className="size-4"
                            />
                          </button>
                        </div>

                        {!line.available ? (
                          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.12em] text-gold-deep">
                            Availability changed — remove to continue
                          </p>
                        ) : null}

                        <div className="mt-4 flex items-end justify-between gap-2">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.variant.id, line.quantity - 1)
                              }
                              className="inline-flex size-8 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink"
                              aria-label={`Decrease quantity of ${line.product.name}`}
                            >
                              <Minus
                                aria-hidden="true"
                                className="size-3"
                                strokeWidth={1.5}
                              />
                            </button>
                            <span
                              className="w-7 text-center text-[0.72rem] tabular-nums"
                              aria-live="polite"
                            >
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.variant.id, line.quantity + 1)
                              }
                              className="inline-flex size-8 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink"
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
                            className="text-[0.8rem] text-ink/80"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-5 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone">
                      Subtotal
                    </span>
                    <Price
                      amountKobo={summary.subtotalKobo}
                      className="text-base"
                    />
                  </div>
                  <p className="mt-2 text-[0.68rem] leading-relaxed text-ink/50">
                    Shipping calculated at checkout. Payment settles in Naira;
                    other display currencies are indicative.
                  </p>

                  <div className="mt-5 grid gap-2.5">
                    <ButtonLink
                      href="/checkout"
                      variant="primary"
                      onClick={closeCart}
                      aria-disabled={summary.hasIssues}
                      className={
                        summary.hasIssues
                          ? "pointer-events-none opacity-40"
                          : undefined
                      }
                    >
                      Checkout
                    </ButtonLink>
                    <ButtonLink
                      href="/cart"
                      variant="secondary"
                      onClick={closeCart}
                    >
                      View full bag
                    </ButtonLink>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
