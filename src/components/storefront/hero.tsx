import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { getProductBySlug } from "@/modules/catalogue/queries";

export function Hero() {
  const featured = getProductBySlug("regent-court-low");
  const image = featured?.images[0];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="container-luxe grid gap-10 pb-14 pt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-20 lg:pt-14">
        <div className="order-1 lg:col-span-6 lg:pr-6">
          <p className="eyebrow animate-fade-in text-gold-deep">
            Savvy Style · Nigeria
          </p>

          <h1 className="text-hero mt-6">
            <span className="block overflow-hidden pb-1">
              <span className="animate-hero-line block">Home to</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="animate-hero-line block [animation-delay:140ms]">
                the <em className="italic text-gold-deep">classy</em>.
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-md animate-fade-up text-[0.95rem] leading-relaxed text-ink/65 [animation-delay:320ms]">
            Sneakers and footwear chosen for shape, finish and the way they
            carry a room. A tight edit — ready to wear now, or reserved before
            the next shipment lands.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:420ms]">
            <ButtonLink href="/shop">
              Shop the collection
              <ArrowRight
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.6}
              />
            </ButtonLink>
            <ButtonLink href="/pre-orders" variant="secondary">
              Explore pre-orders
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg animate-fade-up grid-cols-3 gap-4 border-t border-line pt-5 [animation-delay:520ms]">
            <div>
              <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-stone">
                Delivery
              </dt>
              <dd className="mt-1.5 text-[0.72rem] leading-snug text-ink/75">
                Lagos, Nigeria & worldwide
              </dd>
            </div>
            <div>
              <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-stone">
                Availability
              </dt>
              <dd className="mt-1.5 text-[0.72rem] leading-snug text-ink/75">
                Ready stock & pre-order
              </dd>
            </div>
            <div>
              <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-stone">
                Settlement
              </dt>
              <dd className="mt-1.5 text-[0.72rem] leading-snug text-ink/75">
                Nigerian Naira
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative order-2 lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand animate-image-reveal sm:aspect-[5/4] lg:aspect-[4/5]">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: image.position ?? "center" }}
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent"
            />
            <p className="absolute bottom-4 left-4 text-[0.55rem] uppercase tracking-[0.24em] text-paper/80">
              The current edit · 01
            </p>
          </div>

          {featured ? (
            <Link
              href={`/product/${featured.slug}`}
              className="group absolute -bottom-6 left-4 hidden w-[15.5rem] border border-line bg-paper p-4 shadow-[0_18px_45px_-30px_rgba(25,21,17,0.55)] transition-colors hover:border-ink/30 sm:block lg:-left-10"
            >
              <p className="text-[0.52rem] uppercase tracking-[0.22em] text-gold-deep">
                Featured now
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-lg leading-tight">
                    {featured.name}
                  </p>
                  <p className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-stone">
                    {featured.subtitle}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="mb-1 size-4 shrink-0 text-ink/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink"
                  strokeWidth={1.4}
                />
              </div>
              <Price
                amountKobo={featured.basePriceKobo}
                className="mt-3 block text-[0.72rem] text-ink/70"
              />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
