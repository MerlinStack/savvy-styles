import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section className="border-t border-line bg-ink text-paper">
      <div className="container-luxe grid gap-8 py-16 lg:grid-cols-12 lg:gap-6 lg:py-20">
        <div className="lg:col-span-5">
          <p className="eyebrow text-gold-light">Notes</p>
          <h2 className="text-section-title mt-4">
            Notes from the{" "}
            <em className="italic text-gold-light">house</em>.
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-2">
          <p className="max-w-md text-[0.85rem] leading-relaxed text-paper/60">
            New arrivals, pre-order windows and the occasional considered word.
            Sent sparingly, never sold on.
          </p>
          <NewsletterForm tone="dark" source="homepage" className="mt-6" />
        </div>
      </div>
    </section>
  );
}
