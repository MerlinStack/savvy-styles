"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";
import { useWishlistStore } from "@/modules/wishlist/store";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  tone?: "light" | "dark";
}

export function WishlistButton({
  productId,
  className,
  tone = "light",
}: WishlistButtonProps) {
  const hydrated = useHydrated();
  const active = useWishlistStore((state) =>
    state.productIds.includes(productId),
  );
  const toggle = useWishlistStore((state) => state.toggle);
  const isActive = hydrated && active;

  return (
    <button
      type="button"
      aria-label={isActive ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={isActive}
      onClick={() => toggle(productId)}
      className={cn(
        "inline-flex size-10 items-center justify-center border border-transparent transition-colors duration-200",
        tone === "light"
          ? "text-ink hover:border-line hover:bg-paper/80"
          : "text-paper hover:border-paper/30 hover:bg-paper/10",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={1.4}
        className={cn("size-[18px]", isActive && "fill-current text-gold-deep")}
      />
    </button>
  );
}
