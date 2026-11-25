import { PRODUCTS, CATEGORIES } from "./fixtures";
import type {
  CatalogueFilters,
  Category,
  CategorySlug,
  Product,
  ProductVariant,
} from "./types";

const priceFormatter = new Intl.Collator("en", { sensitivity: "base" });

export function getAllProducts(): readonly Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getVariant(
  product: Product,
  variantId: string,
): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId);
}

export function isVariantPurchasable(
  product: Product,
  variant: ProductVariant,
): boolean {
  if (!variant.active) return false;
  if (product.availability === "preorder") return true;
  return variant.stock > 0;
}

export function getAvailableSizes(product: Product): string[] {
  return product.variants
    .filter((variant) => isVariantPurchasable(product, variant))
    .map((variant) => variant.size)
    .filter((size, index, sizes) => sizes.indexOf(size) === index);
}

export function getCategories(): readonly Category[] {
  return CATEGORIES;
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return PRODUCTS.filter((product) => product.featured).slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return [...PRODUCTS]
    .filter((product) => product.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function getBestSellers(limit = 4): Product[] {
  return PRODUCTS.filter((product) => product.bestSeller).slice(0, limit);
}

export function getReadyStock(limit?: number): Product[] {
  const products = PRODUCTS.filter(
    (product) =>
      product.availability === "ready" &&
      product.variants.some((variant) => variant.stock > 0),
  );
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export function getPreOrderProducts(limit?: number): Product[] {
  const products = PRODUCTS.filter(
    (product) => product.availability === "preorder",
  );
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === product.category) score += 3;
      if (candidate.audience === product.audience) score += 1;
      if (candidate.bestSeller) score += 0.5;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function filterProducts(filters: CatalogueFilters): Product[] {
  const query = filters.query?.trim().toLowerCase();

  const filtered = PRODUCTS.filter((product) => {
    if (filters.newOnly && !product.isNew) {
      return false;
    }

    if (
      filters.categories?.length &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    if (
      filters.availability &&
      filters.availability !== "all" &&
      product.availability !== filters.availability
    ) {
      return false;
    }

    if (
      filters.audience &&
      filters.audience !== "all" &&
      product.audience !== filters.audience &&
      product.audience !== "unisex"
    ) {
      return false;
    }

    if (
      typeof filters.minPriceKobo === "number" &&
      product.basePriceKobo < filters.minPriceKobo
    ) {
      return false;
    }

    if (
      typeof filters.maxPriceKobo === "number" &&
      product.basePriceKobo > filters.maxPriceKobo
    ) {
      return false;
    }

    if (filters.sizes?.length) {
      const hasSize = product.variants.some(
        (variant) =>
          variant.active &&
          filters.sizes!.includes(variant.size) &&
          (product.availability === "preorder" || variant.stock > 0),
      );
      if (!hasSize) return false;
    }

    if (query) {
      const searchable = [
        product.name,
        product.subtitle,
        product.description,
        product.category,
        product.audience,
        ...product.variants.map((variant) => variant.colour),
      ]
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    return true;
  });

  return sortProducts(filtered, filters.sort ?? "featured");
}

export function sortProducts(
  products: readonly Product[],
  sort: CatalogueFilters["sort"],
): Product[] {
  const copy = [...products];

  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "price-asc":
      return copy.sort((a, b) => a.basePriceKobo - b.basePriceKobo);
    case "price-desc":
      return copy.sort((a, b) => b.basePriceKobo - a.basePriceKobo);
    case "name":
      return copy.sort((a, b) => priceFormatter.compare(a.name, b.name));
    case "featured":
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }
}

export function getAvailableSizesForCatalogue(): string[] {
  const sizes = new Set<string>();
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      if (variant.active) sizes.add(variant.size);
    }
  }
  return [...sizes].sort((a, b) => Number(a) - Number(b));
}

export function getCategoryCount(slug: CategorySlug): number {
  return PRODUCTS.filter((product) => product.category === slug).length;
}

export function getPriceBounds(): { minKobo: number; maxKobo: number } {
  const prices = PRODUCTS.map((product) => product.basePriceKobo);
  return {
    minKobo: Math.min(...prices),
    maxKobo: Math.max(...prices),
  };
}
