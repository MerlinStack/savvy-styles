import { nairaToKobo } from "@/modules/money";
import {
  CATEGORY_SLUGS,
  type CatalogueFilters,
  type CatalogueSort,
  type CategorySlug,
} from "./types";

export interface RawSearchParams {
  [key: string]: string | string[] | undefined;
}

const SORTS: readonly CatalogueSort[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name",
];

const AUDIENCES = ["men", "women", "unisex"] as const;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Accepts `?size=42&size=43` and `?size=42,43` interchangeably. */
function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

function parseNaira(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value.replace(/[^\d]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.floor(parsed);
}

export function parseCatalogueFilters(raw: RawSearchParams): CatalogueFilters {
  const filters: CatalogueFilters = {};

  const query = first(raw.q)?.trim();
  if (query) filters.query = query.slice(0, 80);

  const categories = list(raw.category).filter(isCategorySlug);
  if (categories.length > 0) {
    filters.categories = [...new Set(categories)];
  }

  const sizes = list(raw.size).filter((size) => /^\d{2}(\.5)?$/.test(size));
  if (sizes.length > 0) filters.sizes = [...new Set(sizes)];

  const availability = first(raw.availability);
  if (availability === "ready" || availability === "preorder") {
    filters.availability = availability;
  }

  const audience = first(raw.audience);
  if (
    audience &&
    (AUDIENCES as readonly string[]).includes(audience)
  ) {
    filters.audience = audience as (typeof AUDIENCES)[number];
  }

  const min = parseNaira(first(raw.min));
  const max = parseNaira(first(raw.max));
  if (typeof min === "number") filters.minPriceKobo = nairaToKobo(min);
  if (typeof max === "number") filters.maxPriceKobo = nairaToKobo(max);

  const sort = first(raw.sort);
  if (sort && (SORTS as readonly string[]).includes(sort)) {
    filters.sort = sort as CatalogueSort;
  }

  return filters;
}

export function catalogueQuery(filters: CatalogueFilters): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.categories?.length) {
    params.set("category", filters.categories.join(","));
  }
  if (filters.sizes?.length) params.set("size", filters.sizes.join(","));
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.audience) params.set("audience", filters.audience);
  if (typeof filters.minPriceKobo === "number") {
    params.set("min", String(Math.round(filters.minPriceKobo / 100)));
  }
  if (typeof filters.maxPriceKobo === "number") {
    params.set("max", String(Math.round(filters.maxPriceKobo / 100)));
  }
  if (filters.sort) params.set("sort", filters.sort);

  return params.toString();
}

export function catalogueHref(
  filters: CatalogueFilters,
  overrides: Partial<CatalogueFilters> = {},
  path = "/shop",
): string {
  const merged: CatalogueFilters = { ...filters, ...overrides };
  const query = catalogueQuery(merged);
  return query ? `${path}?${query}` : path;
}

export function withoutValue<T>(
  values: readonly T[] | undefined,
  value: T,
): T[] {
  return (values ?? []).filter((entry) => entry !== value);
}

export function withValue<T>(
  values: readonly T[] | undefined,
  value: T,
): T[] {
  const current = values ?? [];
  return current.includes(value) ? [...current] : [...current, value];
}

export function countActiveFilters(filters: CatalogueFilters): number {
  let count = 0;
  if (filters.query) count += 1;
  count += filters.categories?.length ?? 0;
  count += filters.sizes?.length ?? 0;
  if (filters.availability) count += 1;
  if (filters.audience) count += 1;
  if (
    typeof filters.minPriceKobo === "number" ||
    typeof filters.maxPriceKobo === "number"
  ) {
    count += 1;
  }
  return count;
}

export function describePriceBand(filters: CatalogueFilters): string | null {
  const min = filters.minPriceKobo;
  const max = filters.maxPriceKobo;
  if (typeof min !== "number" && typeof max !== "number") return null;
  if (typeof min === "number" && typeof max === "number") {
    return `₦${Math.round(min / 100).toLocaleString("en-NG")} – ₦${Math.round(max / 100).toLocaleString("en-NG")}`;
  }
  if (typeof min === "number") {
    return `From ₦${Math.round(min / 100).toLocaleString("en-NG")}`;
  }
  return `Up to ₦${Math.round((max ?? 0) / 100).toLocaleString("en-NG")}`;
}
