import {
  getAvailableSizesForCatalogue,
  getPriceBounds,
  getCategories,
} from "@/modules/catalogue/queries";
import type { CatalogueFilters } from "@/modules/catalogue/types";
import { Button, ButtonLink } from "@/components/ui/button";

interface FilterPanelProps {
  filters: CatalogueFilters;
  path: string;
  idPrefix: string;
  showAvailability?: boolean;
}

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All pieces" },
  { value: "ready", label: "Ready stock" },
  { value: "preorder", label: "Pre-order" },
] as const;

const AUDIENCE_OPTIONS = [
  { value: "all", label: "Everyone" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
] as const;

/**
 * A plain GET form: every filter is a native control, so the catalogue works
 * without client JavaScript and every state is shareable as a URL.
 */
export function FilterPanel({
  filters,
  path,
  idPrefix,
  showAvailability = true,
}: FilterPanelProps) {
  const sizes = getAvailableSizesForCatalogue();
  const bounds = getPriceBounds();
  const categoryOptions = getCategories();

  return (
    <form method="get" action={path} className="space-y-7">
      {filters.sort && filters.sort !== "featured" ? (
        <input type="hidden" name="sort" value={filters.sort} />
      ) : null}

      <div>
        <label
          htmlFor={`${idPrefix}-q`}
          className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone"
        >
          Search
        </label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          type="search"
          defaultValue={filters.query ?? ""}
          placeholder="Name, colour or form"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm text-ink outline-none placeholder:text-stone/70 focus:border-ink"
        />
      </div>

      <fieldset>
        <legend className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone">
          Category
        </legend>
        <div className="mt-3 space-y-2.5">
          {categoryOptions.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2.5 text-[0.8rem] text-ink/75"
            >
              <input
                type="checkbox"
                name="category"
                value={category.slug}
                defaultChecked={filters.categories?.includes(category.slug)}
                className="size-3.5 accent-ink"
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      {showAvailability ? (
        <fieldset>
          <legend className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone">
            Availability
          </legend>
          <div className="mt-3 space-y-2.5">
            {AVAILABILITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 text-[0.8rem] text-ink/75"
              >
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  defaultChecked={
                    (filters.availability ?? "all") === option.value
                  }
                  className="size-3.5 accent-ink"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone">
          Size (EU)
        </legend>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex h-9 w-11 cursor-pointer items-center justify-center border border-line text-[0.7rem] tabular-nums text-ink/70 transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-deep"
            >
              <input
                type="checkbox"
                name="size"
                value={size}
                defaultChecked={filters.sizes?.includes(size)}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone">
          Cut
        </legend>
        <div className="mt-3 space-y-2.5">
          {AUDIENCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-[0.8rem] text-ink/75"
            >
              <input
                type="radio"
                name="audience"
                value={option.value}
                defaultChecked={(filters.audience ?? "all") === option.value}
                className="size-3.5 accent-ink"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone">
          Price (₦)
        </legend>
        <div className="mt-3 flex items-center gap-2">
          <input
            aria-label="Minimum price in naira"
            name="min"
            type="number"
            inputMode="numeric"
            min={0}
            step={5000}
            defaultValue={
              typeof filters.minPriceKobo === "number"
                ? Math.round(filters.minPriceKobo / 100)
                : ""
            }
            placeholder={String(Math.round(bounds.minKobo / 100))}
            className="w-full border border-line bg-transparent px-2.5 py-2 text-[0.75rem] tabular-nums outline-none focus:border-ink"
          />
          <span aria-hidden="true" className="text-stone">
            —
          </span>
          <input
            aria-label="Maximum price in naira"
            name="max"
            type="number"
            inputMode="numeric"
            min={0}
            step={5000}
            defaultValue={
              typeof filters.maxPriceKobo === "number"
                ? Math.round(filters.maxPriceKobo / 100)
                : ""
            }
            placeholder={String(Math.round(bounds.maxKobo / 100))}
            className="w-full border border-line bg-transparent px-2.5 py-2 text-[0.75rem] tabular-nums outline-none focus:border-ink"
          />
        </div>
      </fieldset>

      <div className="grid gap-2">
        <Button type="submit" variant="primary">
          Apply filters
        </Button>
        <ButtonLink href={path} variant="secondary">
          Clear
        </ButtonLink>
      </div>
    </form>
  );
}
