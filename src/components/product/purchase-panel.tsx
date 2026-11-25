"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";
import type { Product } from "@/modules/catalogue/types";
import { checkPurchase } from "@/modules/inventory";
import { useCartStore } from "@/modules/cart/store";
import { useUiStore } from "@/modules/ui/store";
import { useWishlistStore } from "@/modules/wishlist/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface PurchasePanelProps {
  product: Product;
}

export function PurchasePanel({ product }: PurchasePanelProps) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const hydrated = useHydrated();
  const saved = useWishlistStore((state) =>
    state.productIds.includes(product.id),
  );
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const selected = useMemo(
    () => product.variants.find((variant) => variant.size === size) ?? null,
    [product.variants, size],
  );

  const maxQuantity = selected
    ? Math.max(1, checkPurchase(product, selected, 1).maxQuantity)
    : 1;

  const isPreorder = product.availability === "preorder";
  const savedActive = hydrated && saved;

  function handleAdd() {
    if (!selected) {
      setMessage("Choose a size to continue.");
      return;
    }

    const result = addItem(product.id, selected.id, quantity);

    if (!result.ok) {
      setMessage(result.reason ?? "This piece could not be added.");
      return;
    }

    setMessage(null);
    setQuantity(1);
    openCart();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-stone">
          Select size (EU)
        </h3>
        <Link
          href="/contact"
          className="text-[0.6rem] uppercase tracking-[0.12em] text-gold-deep underline-offset-4 hover:underline"
        >
          Need a size?
        </Link>
      </div>

      <div
        role="group"
        aria-label="Select a size"
        className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-6"
      >
        {product.variants.map((variant) => {
          const purchasable =
            variant.active &&
            (isPreorder || variant.stock > 0);
          const active = size === variant.size;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => {
                setSize(variant.size);
                setQuantity(1);
                setMessage(null);
              }}
              disabled={!purchasable}
              aria-pressed={active}
              className={cn(
                "relative flex h-11 items-center justify-center border text-[0.72rem] tabular-nums transition-colors duration-200",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink/75 hover:border-ink",
                !purchasable &&
                  "cursor-not-allowed border-line/70 text-stone/45 line-through hover:border-line/70",
              )}
            >
              {variant.size}
              {!purchasable ? (
                <span className="sr-only"> — unavailable</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p
        className="mt-3 min-h-5 text-[0.68rem] leading-relaxed text-ink/50"
        aria-live="polite"
      >
        {selected
          ? isPreorder
            ? `Fully paid pre-order · ${product.preorderEta ?? "window confirmed before dispatch"}`
            : selected.stock > 0
              ? `${selected.stock} in stock in size ${selected.size}`
              : "This size is currently unavailable."
          : isPreorder
            ? `Pre-order · ${product.preorderEta ?? "window confirmed before dispatch"}`
            : "Ready stock ships from Lagos."}
      </p>

      <div className="mt-4 flex items-center justify-between border border-line px-3 py-2">
        <span className="text-[0.62rem] uppercase tracking-[0.16em] text-stone">
          Quantity
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            className="inline-flex size-8 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Decrease quantity"
          >
            <Minus aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </button>
          <span
            className="w-6 text-center text-[0.75rem] tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(maxQuantity, value + 1))
            }
            disabled={quantity >= maxQuantity}
            className="inline-flex size-8 items-center justify-center text-ink/65 transition-colors hover:bg-sand/60 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Increase quantity"
          >
            <Plus aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {message ? (
        <p
          role="alert"
          className="mt-3 border border-gold-deep/30 bg-gold/10 px-3 py-2 text-[0.72rem] leading-relaxed text-gold-deep"
        >
          {message}
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleAdd}
        className="mt-4 min-h-12 w-full"
      >
        {isPreorder ? "Reserve this pair" : "Add to bag"}
      </Button>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={savedActive}
        className="mt-2 flex w-full items-center justify-center gap-2 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink"
      >
        <Heart
          aria-hidden="true"
          strokeWidth={1.4}
          className={cn("size-4", savedActive && "fill-current text-gold-deep")}
        />
        {savedActive ? "Saved to wishlist" : "Save for later"}
      </button>

      <p className="mt-4 border-t border-line pt-4 text-[0.68rem] leading-relaxed text-ink/45">
        Delivery calculated at checkout. Lagos, nationwide and international
        zones. Payment settles in Naira.
      </p>
    </div>
  );
}
