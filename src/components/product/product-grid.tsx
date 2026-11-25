import type { Product } from "@/modules/catalogue/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/cn";

interface ProductGridProps {
  products: readonly Product[];
  className?: string;
  eagerCount?: number;
  sizes?: string;
}

export function ProductGrid({
  products,
  className,
  eagerCount = 0,
  sizes,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 lg:gap-y-14",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          eager={index < eagerCount}
          sizes={sizes}
        />
      ))}
    </div>
  );
}
