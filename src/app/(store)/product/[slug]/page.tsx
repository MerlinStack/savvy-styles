import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityBadge } from "@/components/product/availability-badge";
import { ProductGrid } from "@/components/product/product-grid";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categoryName,
  PRODUCTS,
} from "@/modules/catalogue/fixtures";
import { getProductBySlug, getRelatedProducts } from "@/modules/catalogue/queries";
import { audienceLabel, availabilityLabel } from "@/modules/catalogue/labels";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

type ProductPageProps = PageProps<"/product/[slug]">;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Resolved before the shell streams, so an unknown slug is a real 404.
  if (!product) {
    notFound();
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "website",
      images: [
        {
          url: product.images[0].src,
          alt: product.images[0].alt,
        },
      ],
    },
  };
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductDetail params={props.params} />
    </Suspense>
  );
}

async function ProductDetail({
  params,
}: Pick<ProductPageProps, "params">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 4);
  const category = categoryName(product.category);
  // Fixtures may reuse one photograph with different crops; showing the same
  // source twice reads as a duplicate rather than a gallery.
  const gallery = product.images.filter(
    (image, index, images) =>
      images.findIndex((candidate) => candidate.src === image.src) === index,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: new URL(product.images[0].src, SITE.url).toString(),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: "Savvy Style" },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: (product.basePriceKobo / 100).toFixed(2),
      availability:
        product.availability === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      url: new URL(`/product/${product.slug}`, SITE.url).toString(),
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-luxe">
        <nav
          aria-label="Breadcrumb"
          className="pt-6 text-[0.56rem] uppercase tracking-[0.16em] text-stone"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="transition-colors hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/shop?category=${product.category}`}
                className="transition-colors hover:text-ink"
              >
                {category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink/70">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-24">
          <div className="lg:col-span-7">
            <div className="space-y-3">
              {gallery.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden bg-sand",
                    index > 0 && "hidden lg:block",
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                    style={{ objectPosition: image.position ?? "center" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-gold-deep">
                {category} · {audienceLabel(product.audience)}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,3.2vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">
                {product.name}
              </h1>
              <p className="mt-2 text-[0.66rem] uppercase tracking-[0.16em] text-stone">
                {product.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Price
                  amountKobo={product.basePriceKobo}
                  showCode
                  className="text-[1.15rem]"
                />
                <AvailabilityBadge label={availabilityLabel(product)} />
              </div>

              <p className="mt-5 text-[0.85rem] leading-[1.75] text-ink/65">
                {product.description}
              </p>
              <p className="mt-3 font-display text-[1.05rem] italic leading-relaxed text-ink/55">
                {product.story}
              </p>

              <div className="mt-7">
                <PurchasePanel product={product} />
              </div>

              <div className="mt-7">
                <ProductDetailSection
                  title="Materials & construction"
                  defaultOpen
                >
                  <ul className="list-disc space-y-1.5 pl-4">
                    {product.materials.map((material) => (
                      <li key={material}>{material}</li>
                    ))}
                  </ul>
                </ProductDetailSection>

                <ProductDetailSection title="Care">
                  <p>{product.care}</p>
                </ProductDetailSection>

                <ProductDetailSection title="Delivery">
                  <p>
                    Shipping is calculated at checkout by destination, across
                    Lagos, nationwide and international zones. This preview uses
                    sample delivery rates pending owner-approved courier
                    pricing.
                  </p>
                </ProductDetailSection>

                {product.availability === "preorder" ? (
                  <ProductDetailSection title="Pre-order terms">
                    <p>
                      Pre-orders are fully paid and allocated in the order
                      payments are received. The window shown here is a sample
                      value in this preview and will be confirmed by the house
                      before launch.
                    </p>
                  </ProductDetailSection>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-line bg-paper">
        <div className="container-luxe section-pad">
          <SectionHeading
            eyebrow="Continue"
            title={
              <>
                You may also{" "}
                <em className="italic text-gold-deep">consider</em>.
              </>
            }
            action={{ href: "/shop", label: "All footwear" }}
          />
          <ProductGrid
            products={related}
            className="mt-10 md:grid-cols-2 lg:grid-cols-4"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </section>
    </article>
  );
}

function ProductDetailSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-t border-line py-4 last:border-b"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-[0.62rem] uppercase tracking-[0.18em] text-ink">
        {title}
        <span
          aria-hidden="true"
          className="text-base leading-none text-stone transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-3 text-[0.78rem] leading-relaxed text-ink/60">
        {children}
      </div>
    </details>
  );
}

function ProductFallback() {
  return (
    <div className="container-luxe py-8" aria-busy="true">
      <p className="sr-only">Loading product</p>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="aspect-[4/5] animate-pulse bg-sand lg:col-span-7" />
        <div className="space-y-4 lg:col-span-4 lg:col-start-9">
          <div className="h-2.5 w-28 animate-pulse bg-sand" />
          <div className="h-10 w-3/4 animate-pulse bg-sand" />
          <div className="h-4 w-1/2 animate-pulse bg-sand/70" />
          <div className="h-24 w-full animate-pulse bg-sand/50" />
        </div>
      </div>
    </div>
  );
}
