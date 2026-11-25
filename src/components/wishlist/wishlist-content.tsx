"use client";

import Link from "next/link";
import { useWishlistStore } from "@/modules/wishlist/store";
import { getProductById } from "@/modules/catalogue/queries";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";

export function WishlistContent() {
  const hydrated = useHydrated();
  const productIds = useWishlistStore((state) => state.productIds);
  const clear = useWishlistStore((state) => state.clear);

  const products = productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div className="container-luxe py-10 lg:py-16">
      <p className="eyebrow text-gold-deep">Saved</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-page-title">
          Kept for{" "}
          <em className="italic text-gold-deep">later</em>.
        </h1>
        {hydrated && products.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="pb-2 text-[0.62rem] uppercase tracking-[0.14em] text-stone transition-colors hover:text-ink"
          >
            Clear wishlist
          </button>
        ) : null}
      </div>

      {!hydrated ? (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse bg-sand" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10 border-y border-line py-16 sm:py-24">
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-3xl leading-tight sm:text-4xl">
              Nothing saved yet.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/55">
              Tap the heart on any piece to keep it here while you decide. Saved
              items live on this device.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/shop">Browse the collection</ButtonLink>
              <ButtonLink href="/pre-orders" variant="secondary">
                Pre-orders
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 text-[0.62rem] uppercase tracking-[0.18em] text-stone">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                eager={index < 3}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ))}
          </div>
          <p className="mt-10 text-[0.7rem] text-ink/45">
            Saved items are stored in this browser.{" "}
            <Link href="/about" className="link-underline text-ink/60">
              About Savvy Style
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
