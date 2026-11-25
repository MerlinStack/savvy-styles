import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getCategoryCount } from "@/modules/catalogue/queries";

export function CategoryIndex() {
  const categories = getCategories();

  return (
    <section className="section-pad">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Shop by form"
          title={
            <>
              Four ways to{" "}
              <em className="italic text-gold-deep">arrive</em>.
            </>
          }
          action={{ href: "/collections", label: "View collections" }}
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-12 lg:grid-cols-4 lg:gap-x-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  style={{
                    objectPosition: category.image.position ?? "center",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <div>
                    <h3 className="font-display text-[1.4rem] leading-none text-paper">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-[0.55rem] uppercase tracking-[0.18em] text-paper/60">
                      {getCategoryCount(category.slug)} pieces
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={1.3}
                    className="mb-0.5 size-4 text-paper/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
