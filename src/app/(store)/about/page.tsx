import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxMedia } from "@/components/storefront/parallax-media";
import { EDITORIAL_IMAGES } from "@/modules/catalogue/fixtures";

export const metadata: Metadata = {
  title: "The house",
  description:
    "Savvy Style is a Nigerian footwear house built around a tight edit — ready stock, fully paid pre-orders and considered delivery.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Ready stock",
    copy: "Pieces in hand now. The sizes shown are the ones available to dispatch.",
  },
  {
    number: "02",
    title: "Pre-orders",
    copy: "Fully paid and allocated in order of payment, before the next shipment lands.",
  },
  {
    number: "03",
    title: "Delivery",
    copy: "Lagos, nationwide and international. Rates are calculated by destination at checkout.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-luxe py-12 lg:py-20">
          <p className="eyebrow text-gold-deep">The house</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 className="text-page-title lg:col-span-8">
              A small house for{" "}
              <em className="italic text-gold-deep">considered</em> footwear.
            </h1>
            <p className="max-w-xs text-[0.85rem] leading-relaxed text-ink/60 lg:col-span-3 lg:col-start-10 lg:pb-2">
              Savvy Style Nigeria. One edit, held to a standard, offered with
              clear availability.
            </p>
          </div>
        </div>
      </header>

      <section className="container-luxe py-10 lg:py-14">
        <Reveal>
          <ParallaxMedia
            src={EDITORIAL_IMAGES.campaign.src}
            alt={EDITORIAL_IMAGES.campaign.alt}
            className="aspect-[4/5] sm:aspect-[16/10]"
            sizes="(max-width: 1440px) 100vw, 90rem"
            eager
          />
        </Reveal>
      </section>

      <section className="container-luxe pb-16 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="eyebrow text-stone lg:col-span-2">The idea</p>
          <div className="lg:col-span-8 lg:col-start-4">
            <p className="font-display text-[clamp(1.65rem,2.8vw,2.8rem)] leading-[1.16] tracking-[-0.02em]">
              “Home to the classy” is not a claim about price. It is a standard
              about{" "}
              <em className="italic text-gold-deep">restraint</em> — the line of
              a toe, the weight of a sole, the way a colour reads in daylight.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-10">
              <p className="text-[0.85rem] leading-[1.8] text-ink/60">
                Savvy Style began with a simple frustration: the pairs worth
                wearing were scattered across feeds, stores and waiting lists.
                The house brings them into one tight edit, with availability
                stated plainly — ready stock in hand, or pre-order reserved
                before the next shipment.
              </p>
              <p className="text-[0.85rem] leading-[1.8] text-ink/60">
                Every piece is chosen for proportion, finish and wearability.
                The edit is deliberately small. If a pair is not right, it does
                not make the page. That is the whole method.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="container-luxe grid gap-8 py-14 sm:grid-cols-3 sm:gap-6 lg:py-18">
          {PRINCIPLES.map((principle) => (
            <div key={principle.number}>
              <p className="text-[0.6rem] tabular-nums tracking-[0.2em] text-gold-deep">
                {principle.number}
              </p>
              <h2 className="mt-4 font-display text-2xl">{principle.title}</h2>
              <p className="mt-2 max-w-xs text-[0.8rem] leading-relaxed text-ink/55">
                {principle.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe section-pad">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="eyebrow text-stone lg:col-span-2">The standard</p>
          <div className="lg:col-span-7 lg:col-start-4">
            <h2 className="text-section-title">
              What we do not{" "}
              <em className="italic text-gold-deep">do</em>.
            </h2>
            <ul className="mt-8 space-y-5">
              {[
                "We do not list pieces we cannot source.",
                "We do not count pre-order demand as stock in hand.",
                "We do not invent a delivery promise we cannot keep.",
                "We do not present development fixtures as current inventory.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-4 border-b border-line pb-5 text-[0.88rem] leading-relaxed text-ink/65"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-6 shrink-0 bg-gold"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-paper lg:py-20">
        <div className="container-luxe grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-light">Begin</p>
            <h2 className="text-section-title mt-4">
              The collection is{" "}
              <em className="italic text-gold-light">open</em>.
            </h2>
            <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-paper/60">
              Browse what is ready to dispatch, or reserve a piece from the next
              shipment. For anything else, the house is reachable.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <ButtonLink href="/shop" variant="inverse">
              Shop the collection
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
