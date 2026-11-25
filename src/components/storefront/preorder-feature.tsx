import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getProductBySlug } from "@/modules/catalogue/queries";

const STEPS = [
  {
    number: "01",
    title: "Choose the pair",
    copy: "Select your size from the pre-order window. The piece is reserved against your name, not a waitlist.",
  },
  {
    number: "02",
    title: "Pay in full",
    copy: "Pre-orders are fully paid. That payment is what secures your size before the shipment is allocated.",
  },
  {
    number: "03",
    title: "Dispatch on arrival",
    copy: "We keep you updated through the window, then dispatch as soon as stock is checked and ready.",
  },
];

export function PreOrderFeature() {
  const product =
    getProductBySlug("archive-350") ?? getProductBySlug("aeon-runner");
  const image = product?.images[0];

  return (
    <section className="bg-ink text-paper">
      <div className="container-luxe grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-24">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft sm:aspect-[5/4] lg:aspect-[4/5]">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
                style={{ objectPosition: image.position ?? "center" }}
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="text-[0.52rem] uppercase tracking-[0.24em] text-gold-light">
                  By reservation
                </p>
                <p className="mt-2 font-display text-2xl leading-none">
                  {product?.name ?? "The next arrival"}
                </p>
              </div>
              <p className="text-[0.55rem] uppercase tracking-[0.16em] text-paper/55">
                Fully paid
              </p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow text-gold-light">Pre-orders</p>
          <h2 className="text-section-title mt-4">
            Reserved in full.
            <br />
            Delivered with{" "}
            <em className="italic text-gold-light">intent</em>.
          </h2>
          <p className="mt-5 max-w-md text-[0.88rem] leading-relaxed text-paper/60">
            Some pairs are worth waiting for. Our pre-order pieces are paid in
            full and allocated in order of payment — no deposit, no guessing.
          </p>

          <ol className="mt-9 space-y-0 border-t border-paper/15">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-paper/15 py-5"
              >
                <span className="pt-0.5 text-[0.6rem] tabular-nums tracking-[0.18em] text-gold-light">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-lg leading-tight text-paper">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-paper/55">
                    {step.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <ButtonLink href="/pre-orders" variant="ghost" className="mt-8">
            View pre-orders
            <ArrowRight
              aria-hidden="true"
              className="size-3.5"
              strokeWidth={1.6}
            />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
