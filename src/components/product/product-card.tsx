import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/modules/catalogue/types";
import { availabilityLabel } from "@/modules/catalogue/labels";
import { Price } from "@/components/ui/price";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
  /** Loads the image immediately. Use only for cards above the fold. */
  eager?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  /** Marks a light card placed on a dark editorial surface. */
  tone?: "light" | "dark";
}

export function ProductCard({
  product,
  eager = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 33vw",
  className,
  imageClassName,
  tone = "light",
}: ProductCardProps) {
  const image = product.images[0];
  const label = availabilityLabel(product);

  return (
    <article className={cn("group relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden",
          tone === "dark" ? "bg-ink-soft" : "bg-sand",
        )}
      >
        <Link
          href={`/product/${product.slug}`}
          className={cn("relative block aspect-[4/5]", imageClassName)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={sizes}
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </Link>

        <span
          className={cn(
            "pointer-events-none absolute left-3 top-3 px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.2em]",
            label === "Pre-order"
              ? "bg-ink text-gold-light"
              : "bg-paper/92 text-ink",
          )}
        >
          {label}
        </span>

        <div className="absolute right-1.5 top-1.5 z-10">
          <WishlistButton
            productId={product.id}
            tone={tone === "dark" ? "dark" : "light"}
            className={cn(
              "size-9 backdrop-blur-[2px]",
              tone === "light" && "bg-paper/70",
            )}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 bg-gradient-to-t from-ink/45 to-transparent px-4 pb-3 pt-10 text-[0.6rem] uppercase tracking-[0.22em] text-paper opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="h-px w-5 bg-gold-light" />
          View
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-display text-[1.2rem] leading-tight",
              tone === "dark" ? "text-paper" : "text-ink",
            )}
          >
            <Link href={`/product/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p
            className={cn(
              "mt-1.5 text-[0.65rem] uppercase tracking-[0.16em]",
              tone === "dark" ? "text-paper/50" : "text-stone",
            )}
          >
            {product.subtitle}
          </p>
        </div>
        <Price
          amountKobo={product.basePriceKobo}
          className={cn(
            "shrink-0 pt-1 text-[0.82rem]",
            tone === "dark" ? "text-paper/80" : "text-ink/80",
          )}
        />
      </div>
    </article>
  );
}
