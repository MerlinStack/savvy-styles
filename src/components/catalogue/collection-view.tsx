import { Suspense, type ReactNode } from "react";
import type { RawSearchParams } from "@/modules/catalogue/params";
import type { CatalogueFilters, CatalogueSort } from "@/modules/catalogue/types";
import { CollectionResults } from "./collection-results";

interface CollectionViewProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  searchParams: Promise<RawSearchParams>;
  path: string;
  baseFilters?: CatalogueFilters;
  showAvailability?: boolean;
  defaultSort?: CatalogueSort;
}

export function CollectionView({
  eyebrow,
  title,
  description,
  searchParams,
  path,
  baseFilters,
  showAvailability,
  defaultSort,
}: CollectionViewProps) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-luxe py-12 lg:py-16">
          <p className="eyebrow text-gold-deep">{eyebrow}</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="text-page-title max-w-3xl">{title}</h1>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-ink/60 lg:pb-2">
              {description}
            </p>
          </div>
        </div>
      </header>

      <Suspense fallback={<CatalogueFallback />}>
        <CollectionResults
          searchParams={searchParams}
          path={path}
          baseFilters={baseFilters}
          showAvailability={showAvailability}
          defaultSort={defaultSort}
        />
      </Suspense>
    </>
  );
}

function CatalogueFallback() {
  return (
    <div className="container-luxe py-10 lg:py-14" aria-busy="true">
      <p className="sr-only">Loading the collection</p>
      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <div className="hidden space-y-6 lg:block">
          <div className="h-3 w-16 animate-pulse bg-sand" />
          <div className="h-9 w-full animate-pulse bg-sand/70" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-3 w-2/3 animate-pulse bg-sand/60"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 w-24 animate-pulse bg-sand" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] animate-pulse bg-sand/70" />
                <div className="mt-4 h-3 w-2/3 animate-pulse bg-sand" />
                <div className="mt-2 h-2 w-1/3 animate-pulse bg-sand/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
