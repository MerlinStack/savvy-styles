import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  filterProducts,
  getAllProducts,
  getAvailableSizes,
  getBestSellers,
  getCategories,
  getCategoryCount,
  getFeaturedProducts,
  getNewArrivals,
  getPreOrderProducts,
  getPriceBounds,
  getProductBySlug,
  getReadyStock,
  getRelatedProducts,
  sortProducts,
} from "@/modules/catalogue/queries";
import { CATEGORY_SLUGS } from "@/modules/catalogue/types";

const products = getAllProducts();

describe("fixture integrity", () => {
  it("has ten labelled development products", () => {
    expect(products).toHaveLength(10);
  });

  it("uses unique ids, slugs and SKUs", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(
      products.length,
    );
    expect(new Set(products.map((product) => product.slug)).size).toBe(
      products.length,
    );

    const skus = products.flatMap((product) =>
      product.variants.map((variant) => variant.sku),
    );
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("gives every product a category, images, variants and SEO copy", () => {
    for (const product of products) {
      expect(CATEGORY_SLUGS).toContain(product.category);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.seo.title.length).toBeGreaterThan(0);
      expect(product.seo.description.length).toBeGreaterThan(0);
      expect(Number.isInteger(product.basePriceKobo)).toBe(true);
      expect(product.basePriceKobo).toBeGreaterThan(0);
    }
  });

  it("points every image at a real file under public/fixtures", () => {
    for (const product of products) {
      for (const image of product.images) {
        expect(image.src.startsWith("/fixtures/products/")).toBe(true);
        const file = path.join(
          process.cwd(),
          "public",
          ...image.src.split("/").filter(Boolean),
        );
        expect(existsSync(file), `${image.src} is missing`).toBe(true);
      }
    }

    for (const category of getCategories()) {
      const file = path.join(
        process.cwd(),
        "public",
        ...category.image.src.split("/").filter(Boolean),
      );
      expect(existsSync(file), `${category.image.src} is missing`).toBe(true);
    }
  });

  it("keeps pre-order variants at zero physical stock", () => {
    for (const product of products) {
      if (product.availability !== "preorder") continue;
      for (const variant of product.variants) {
        expect(variant.stock).toBe(0);
      }
      expect(product.preorderEta?.length).toBeGreaterThan(0);
    }
  });

  it("stocks at least one ready product", () => {
    expect(
      products.some(
        (product) =>
          product.availability === "ready" &&
          product.variants.some((variant) => variant.stock > 0),
      ),
    ).toBe(true);
  });

  it("describes four categories that each hold stock", () => {
    const categories = getCategories();
    expect(categories).toHaveLength(4);
    for (const category of categories) {
      expect(getCategoryCount(category.slug)).toBeGreaterThan(0);
    }
  });
});

describe("lookups", () => {
  it("finds a product by slug", () => {
    expect(getProductBySlug("regent-court-low")?.name).toBe("Regent Court Low");
    expect(getProductBySlug("missing")).toBeUndefined();
  });

  it("lists available sizes, excluding sold-out ready sizes", () => {
    const regent = getProductBySlug("regent-court-low");
    if (!regent) throw new Error("Missing fixture");
    expect(getAvailableSizes(regent)).not.toContain("43");
    expect(getAvailableSizes(regent)).toContain("41");
  });

  it("returns only featured products up to the limit", () => {
    const featured = getFeaturedProducts(2);
    expect(featured).toHaveLength(2);
    expect(featured.every((product) => product.featured)).toBe(true);
  });

  it("returns newest arrivals in descending creation order", () => {
    const arrivals = getNewArrivals(3);
    expect(arrivals.every((product) => product.isNew)).toBe(true);
    const times = arrivals.map((product) => Date.parse(product.createdAt));
    expect([...times].sort((a, b) => b - a)).toEqual(times);
  });

  it("returns best sellers", () => {
    expect(getBestSellers().every((product) => product.bestSeller)).toBe(true);
  });

  it("returns in-stock ready products", () => {
    const ready = getReadyStock();
    expect(ready.length).toBeGreaterThan(0);
    for (const product of ready) {
      expect(product.availability).toBe("ready");
      expect(product.variants.some((variant) => variant.stock > 0)).toBe(true);
    }
  });

  it("returns pre-order products", () => {
    const preorders = getPreOrderProducts();
    expect(preorders.length).toBeGreaterThan(0);
    expect(
      preorders.every((product) => product.availability === "preorder"),
    ).toBe(true);
  });

  it("never relates a product to itself", () => {
    for (const product of products) {
      const related = getRelatedProducts(product, 4);
      expect(related).not.toContain(product);
      expect(related.length).toBeLessThanOrEqual(4);
    }
  });
});

describe("filterProducts", () => {
  it("filters by category", () => {
    const result = filterProducts({ categories: ["formal"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.category === "formal")).toBe(true);
  });

  it("filters by availability", () => {
    expect(
      filterProducts({ availability: "preorder" }).every(
        (product) => product.availability === "preorder",
      ),
    ).toBe(true);
    expect(
      filterProducts({ availability: "ready" }).every(
        (product) => product.availability === "ready",
      ),
    ).toBe(true);
  });

  it("treats unisex products as matching either audience", () => {
    const women = filterProducts({ audience: "women" });
    expect(
      women.every(
        (product) =>
          product.audience === "women" || product.audience === "unisex",
      ),
    ).toBe(true);
  });

  it("applies an inclusive price band", () => {
    const min = 150_000 * 100;
    const max = 200_000 * 100;
    const result = filterProducts({ minPriceKobo: min, maxPriceKobo: max });
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (product) =>
          product.basePriceKobo >= min && product.basePriceKobo <= max,
      ),
    ).toBe(true);
  });

  it("only matches sizes that can actually be bought", () => {
    const results = filterProducts({ sizes: ["43"] });
    for (const product of results) {
      const match = product.variants.find((variant) => variant.size === "43");
      expect(match).toBeDefined();
      expect(
        product.availability === "preorder" || (match?.stock ?? 0) > 0,
      ).toBe(true);
    }
  });

  it("searches names, colour and description case-insensitively", () => {
    expect(
      filterProducts({ query: "REGENT" }).some(
        (product) => product.slug === "regent-court-low",
      ),
    ).toBe(true);
    expect(filterProducts({ query: "smoke" }).length).toBeGreaterThan(0);
    expect(filterProducts({ query: "zzzz-no-match" })).toHaveLength(0);
  });

  it("restricts new-arrivals presets to new products", () => {
    const result = filterProducts({ newOnly: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.isNew)).toBe(true);
  });

  it("does not mutate the fixture collection", () => {
    const before = products.map((product) => product.id);
    filterProducts({ sort: "price-desc" });
    expect(products.map((product) => product.id)).toEqual(before);
  });
});

describe("sortProducts", () => {
  it("sorts by ascending and descending price", () => {
    const ascending = sortProducts(products, "price-asc");
    const descending = sortProducts(products, "price-desc");
    expect(ascending[0].basePriceKobo).toBeLessThanOrEqual(
      ascending[ascending.length - 1].basePriceKobo,
    );
    expect(descending[0].basePriceKobo).toBeGreaterThanOrEqual(
      descending[descending.length - 1].basePriceKobo,
    );
  });

  it("sorts alphabetically", () => {
    const names = sortProducts(products, "name").map((product) => product.name);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  it("puts featured products first by default", () => {
    const sorted = sortProducts(products, "featured");
    const firstUnfeatured = sorted.findIndex((product) => !product.featured);
    if (firstUnfeatured !== -1) {
      expect(
        sorted.slice(firstUnfeatured).every((product) => !product.featured),
      ).toBe(true);
    }
  });
});

describe("price bounds", () => {
  it("matches the fixtures", () => {
    const bounds = getPriceBounds();
    expect(bounds.minKobo).toBe(
      Math.min(...products.map((product) => product.basePriceKobo)),
    );
    expect(bounds.maxKobo).toBe(
      Math.max(...products.map((product) => product.basePriceKobo)),
    );
  });
});
