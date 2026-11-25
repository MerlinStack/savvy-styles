import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  getCategories,
  getCategoryCount,
} from "@/modules/catalogue/queries";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Four collections — lifestyle, performance, casual and formal. The Savvy Style edit, arranged by form.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const categories = getCategories();

  return (
    <>
      <header className="border-b border-line">
        <div className="container-luxe py-12 lg:py-16">
          <p className="eyebrow text-gold-deep">Collections</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="text-page-title lg:col-span-7">
              Four ways to{" "}
              <em className="italic text-gold-deep">arrive</em>.
            </h1>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-ink/60 lg:col-span-4 lg:col-start-9 lg:pb-2">
              Court shapes, technical runners, easy canvas and traditional
              leather. One standard across all four.
            </p>
          </div>
        </div>
      </header>

      <div className="container-luxe space-y-16 py-14 lg:space-y-24 lg:py-20">
        {categories.map((category, index) => {
          const reversed = index % 2 === 1;

          return (
            <Reveal key={category.slug}>
              <article className="grid gap-6 lg:grid-cols-12 lg:items-center">
                <div
                  className={cn(
                    "lg:col-span-7",
                    reversed ? "lg:order-2 lg:col-start-6" : "lg:order-1",
                  )}
                >
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden bg-sand"
                  >
                    <Image
                      src={category.image.src}
                      alt={category.image.alt}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                      style={{
                        objectPosition: category.image.position ?? "center",
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <span className="absolute right-5 top-5 flex size-11 items-center justify-center border border-paper/40 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={1.3}
                      />
                    </span>
                  </Link>
                </div>

                <div
                  className={cn(
                    "lg:col-span-4",
                    reversed
                      ? "lg:order-1 lg:col-start-1"
                      : "lg:order-2 lg:col-start-9",
                  )}
                >
                  <p className="eyebrow text-gold-deep">
                    Collection {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-section-title mt-3">{category.name}</h2>
                  <p className="mt-4 text-[0.85rem] leading-relaxed text-ink/60">
                    {category.description}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <ButtonLink
                      href={`/shop?category=${category.slug}`}
                      variant="secondary"
                    >
                      Shop {category.name.toLowerCase()}
                    </ButtonLink>
                    <span className="text-[0.62rem] uppercase tracking-[0.16em] text-stone">
                      {getCategoryCount(category.slug)} pieces
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
