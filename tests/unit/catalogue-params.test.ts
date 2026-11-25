import { describe, expect, it } from "vitest";
import {
  catalogueHref,
  catalogueQuery,
  countActiveFilters,
  describePriceBand,
  parseCatalogueFilters,
  withValue,
  withoutValue,
} from "@/modules/catalogue/params";

describe("parseCatalogueFilters", () => {
  it("returns an empty filter set for empty input", () => {
    expect(parseCatalogueFilters({})).toEqual({});
  });

  it("trims and truncates the search query", () => {
    expect(parseCatalogueFilters({ q: "  runner  " }).query).toBe("runner");
    expect(parseCatalogueFilters({ q: "x".repeat(120) }).query).toHaveLength(
      80,
    );
  });

  it("takes the first value when a parameter repeats", () => {
    expect(parseCatalogueFilters({ q: ["first", "second"] }).query).toBe(
      "first",
    );
  });

  it("accepts repeated and comma-separated categories, dropping invalid ones", () => {
    expect(
      parseCatalogueFilters({
        category: ["lifestyle,performance", "bogus", "lifestyle"],
      }).categories,
    ).toEqual(["lifestyle", "performance"]);
  });

  it("accepts valid EU sizes only", () => {
    expect(
      parseCatalogueFilters({ size: ["40", "42.5", "43,44", "9", "400", "abc"] })
        .sizes,
    ).toEqual(["40", "42.5", "43", "44"]);
  });

  it("keeps only known availability modes", () => {
    expect(parseCatalogueFilters({ availability: "ready" }).availability).toBe(
      "ready",
    );
    expect(
      parseCatalogueFilters({ availability: "preorder" }).availability,
    ).toBe("preorder");
    expect(
      parseCatalogueFilters({ availability: "all" }).availability,
    ).toBeUndefined();
    expect(
      parseCatalogueFilters({ availability: "bogus" }).availability,
    ).toBeUndefined();
  });

  it("keeps only known audiences", () => {
    expect(parseCatalogueFilters({ audience: "women" }).audience).toBe("women");
    expect(
      parseCatalogueFilters({ audience: "kids" }).audience,
    ).toBeUndefined();
  });

  it("parses prices written with currency formatting", () => {
    const filters = parseCatalogueFilters({ min: "₦120,000", max: "200000" });
    expect(filters.minPriceKobo).toBe(12_000_000);
    expect(filters.maxPriceKobo).toBe(20_000_000);
  });

  it("ignores zero and non-numeric price bounds", () => {
    expect(parseCatalogueFilters({ min: "0" }).minPriceKobo).toBeUndefined();
    expect(
      parseCatalogueFilters({ max: "abc" }).maxPriceKobo,
    ).toBeUndefined();
  });

  it("keeps only known sort orders", () => {
    expect(parseCatalogueFilters({ sort: "price-asc" }).sort).toBe("price-asc");
    expect(parseCatalogueFilters({ sort: "newest" }).sort).toBe("newest");
    expect(parseCatalogueFilters({ sort: "random" }).sort).toBeUndefined();
  });

  it("never reads the internal newOnly preset from the URL", () => {
    expect(parseCatalogueFilters({ newOnly: "true" }).newOnly).toBeUndefined();
  });
});

describe("catalogueQuery", () => {
  it("serialises every filter in a stable order", () => {
    expect(
      catalogueQuery({
        query: "runner",
        categories: ["lifestyle", "performance"],
        sizes: ["41", "42"],
        availability: "ready",
        audience: "men",
        minPriceKobo: 10_000_000,
        maxPriceKobo: 20_000_000,
        sort: "price-asc",
      }),
    ).toBe(
      "q=runner&category=lifestyle%2Cperformance&size=41%2C42&availability=ready&audience=men&min=100000&max=200000&sort=price-asc",
    );
  });

  it("returns an empty string when nothing is set", () => {
    expect(catalogueQuery({})).toBe("");
  });

  it("round-trips through the parser", () => {
    const filters = {
      query: "court",
      categories: ["lifestyle" as const],
      sizes: ["42"],
      availability: "ready" as const,
      sort: "name" as const,
    };
    expect(parseCatalogueFilters(Object.fromEntries(new URLSearchParams(catalogueQuery(filters))))).toEqual(filters);
  });
});

describe("catalogueHref", () => {
  it("uses /shop by default", () => {
    expect(catalogueHref({}, {}, "/shop")).toBe("/shop");
  });

  it("supports preset collection paths", () => {
    expect(catalogueHref({}, {}, "/ready-stock")).toBe("/ready-stock");
    expect(
      catalogueHref({ categories: ["lifestyle"] }, {}, "/ready-stock"),
    ).toBe("/ready-stock?category=lifestyle");
  });

  it("merges overrides without mutating the source filters", () => {
    const filters = { categories: ["lifestyle" as const], sizes: ["41"] };
    const href = catalogueHref(filters, { sizes: undefined });
    expect(href).toBe("/shop?category=lifestyle");
    expect(filters.sizes).toEqual(["41"]);
  });
});

describe("filter helpers", () => {
  it("removes a value without dropping siblings", () => {
    expect(withoutValue(["40", "41", "42"], "41")).toEqual(["40", "42"]);
    expect(withoutValue(undefined, "41")).toEqual([]);
  });

  it("adds a value once", () => {
    expect(withValue(["40"], "41")).toEqual(["40", "41"]);
    expect(withValue(["40"], "40")).toEqual(["40"]);
    expect(withValue(undefined, "40")).toEqual(["40"]);
  });

  it("counts each active filter facet", () => {
    expect(
      countActiveFilters({
        query: "court",
        categories: ["lifestyle", "performance"],
        sizes: ["41", "42"],
        availability: "ready",
        audience: "men",
        minPriceKobo: 10_000_000,
        maxPriceKobo: 20_000_000,
      }),
    ).toBe(8);
  });

  it("counts an open-ended price band once", () => {
    expect(countActiveFilters({ minPriceKobo: 10_000_000 })).toBe(1);
  });

  it("describes closed and open price bands", () => {
    expect(
      describePriceBand({
        minPriceKobo: 12_000_000,
        maxPriceKobo: 20_000_000,
      }),
    ).toBe("₦120,000 – ₦200,000");
    expect(describePriceBand({ minPriceKobo: 12_000_000 })).toBe(
      "From ₦120,000",
    );
    expect(describePriceBand({ maxPriceKobo: 20_000_000 })).toBe(
      "Up to ₦200,000",
    );
    expect(describePriceBand({})).toBeNull();
  });
});
