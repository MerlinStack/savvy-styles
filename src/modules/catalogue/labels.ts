import type { Product } from "./types";

/** Customer-facing availability marker for a whole product. */
export function availabilityLabel(product: Product): string {
  if (product.availability === "preorder") return "Pre-order";
  const stocked = product.variants.some(
    (variant) => variant.active && variant.stock > 0,
  );
  return stocked ? "Ready stock" : "Sold out";
}

export function audienceLabel(audience: Product["audience"]): string {
  return audience === "men"
    ? "Men"
    : audience === "women"
      ? "Women"
      : "Unisex";
}
