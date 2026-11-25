import Link from "next/link";
import { X } from "lucide-react";
import {
  catalogueHref,
  countActiveFilters,
  describePriceBand,
  parseCatalogueFilters,
  withoutValue,
  type RawSearchParams,
} from "@/modules/catalogue/params";
import { filterProducts } from "@/modules/catalogue/queries";
import { categoryName } from "@/modules/catalogue/fixtures";
import type { CatalogueFilters, CatalogueSort } from "@/modules/catalogue/types";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterPanel } from "./filter-panel";

interface CollectionResultsProps {
  searchParams: Promise<RawSearchParams>;
  path: string;
  baseFilters?: CatalogueFilters;
  showAvailability?: boolean;
  defaultSort?: CatalogueSort;
}

const SORT_OPTIONS: { value: CatalogueSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "A–Z" },
];

export async function CollectionResults({
  searchParams,
  path,
  baseFilters,
  showAvailability = true,
  defaultSort = "featured",
}: CollectionResultsProps) {
  const raw = await searchParams;
  const urlFilters = parseCatalogueFilters(raw);
  const filters: CatalogueFilters = {
    ...urlFilters,
    ...baseFilters,
    sort: urlFilters.sort ?? defaultSort,
  };
  const products = filterProducts(filters);
  const activeCount = countActiveFilters(urlFilters);
  const currentSort = urlFilters.sort ?? defaultSort;

  const chips: { key: string; label: string; href: string }[] = [];

  if (urlFilters.query) {
    chips.push({
      key: "query",
      label: `“${urlFilters.query}”`,
      href: catalogueHref(urlFilters, { query: undefined }, path),
    });
  }

  for (const category of urlFilters.categories ?? []) {
    chips.push({
      key: `category-${category}`,
      label: categoryName(category),
      href: catalogueHref(
        urlFilters,
        { categories: withoutValue(urlFilters.categories, category) },
        path,
      ),
    });
  }

  for (const size of urlFilters.sizes ?? []) {
    chips.push({
      key: `size-${size}`,
      label: `Size ${size}`,
      href: catalogueHref(
        urlFilters,
        { sizes: withoutValue(urlFilters.sizes, size) },
        path,
      ),
    });
  }

  if (urlFilters.availability) {
    chips.push({
      key: "availability",
      label:
        urlFilters.availability === "ready" ? "Ready stock" : "Pre-order",
      href: catalogueHref(urlFilters, { availability: undefined }, path),
    });
  }

  if (urlFilters.audience) {
    chips.push({
      key: "audience",
      label: urlFilters.audience.replace(/^\w/, (c) => c.toUpperCase()),
      href: catalogueHref(urlFilters, { audience: undefined }, path),
    });
  }

  const priceLabel = describePriceBand(urlFilters);
  if (priceLabel) {
    chips.push({
      key: "price",
      label: priceLabel,
      href: catalogueHref(
        urlFilters,
        { minPriceKobo: undefined, maxPriceKobo: undefined },
        path,
      ),
    });
  }

  return (
    <div className="container-luxe py-10 lg:py-14">
      <details className="group border-y border-line py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-ink">
          <span>
            Filter &amp; sort
            {activeCount > 0 ? (
              <span className="ml-2 text-gold-deep">({activeCount})</span>
            ) : null}
          </span>
          <span
            aria-hidden="true"
            className="text-lg leading-none text-ink/40 transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <div className="pt-7">
          <FilterPanel
            filters={filters}
            path={path}
            idPrefix="mobile"
            showAvailability={showAvailability}
          />
        </div>
      </details>

      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <aside className="hidden lg:block">
          <div className="no-scrollbar lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pb-4 lg:pr-1">
            <div className="flex items-center justify-between">
              <h2 className="eyebrow text-stone">Filter</h2>
              {activeCount > 0 ? (
                <Link href={path} className="text-[0.62rem] text-gold-deep">
                  Clear
                </Link>
              ) : null}
            </div>
            <div className="mt-6">
              <FilterPanel
                filters={filters}
                path={path}
                idPrefix="desktop"
                showAvailability={showAvailability}
              />
            </div>
          </div>
        </aside>

        <div className="mt-8 lg:mt-0">
          <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-[0.62rem] uppercase tracking-[0.18em] text-stone"
              aria-live="polite"
            >
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
            <nav aria-label="Sort the collection">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {SORT_OPTIONS.map((option) => {
                  const active = currentSort === option.value;
                  return (
                    <li key={option.value}>
                      <Link
                        href={catalogueHref(
                          urlFilters,
                          { sort: option.value },
                          path,
                        )}
                        className={
                          active
                            ? "border-b border-gold pb-1 text-[0.62rem] uppercase tracking-[0.16em] text-ink"
                            : "pb-1 text-[0.62rem] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ink"
                        }
                        aria-current={active ? "true" : undefined}
                      >
                        {option.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {chips.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <Link
                  key={chip.key}
                  href={chip.href}
                  className="inline-flex items-center gap-1.5 border border-line bg-paper px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                >
                  {chip.label}
                  <X
                    aria-hidden="true"
                    strokeWidth={1.6}
                    className="size-3 text-stone"
                  />
                  <span className="sr-only">Remove filter</span>
                </Link>
              ))}
              <Link
                href={path}
                className="ml-1 text-[0.62rem] uppercase tracking-[0.12em] text-gold-deep underline-offset-4 hover:underline"
              >
                Clear all
              </Link>
            </div>
          ) : null}

          {products.length > 0 ? (
            <ProductGrid
              products={products}
              className="mt-8"
              eagerCount={3}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 24vw"
            />
          ) : (
            <div className="mt-10 flex flex-col items-start border border-line bg-paper px-6 py-12 sm:px-10">
              <p className="font-display text-2xl leading-tight sm:text-3xl">
                Nothing in this cut yet.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/55">
                Try a wider price band, another size, or clear the filters to
                see the full collection.
              </p>
              <Link
                href={path}
                className="eyebrow link-underline mt-6 text-ink"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
