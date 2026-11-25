import { Reveal } from "@/components/ui/reveal";

export function HouseStatement() {
  return (
    <section className="section-pad">
      <div className="container-luxe">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12">
            <p className="eyebrow text-stone lg:col-span-2">The house</p>
            <div className="lg:col-span-8 lg:col-start-4">
              <p className="font-display text-[clamp(1.7rem,3.1vw,3.1rem)] leading-[1.14] tracking-[-0.02em] text-ink">
                We choose fewer things, more carefully — footwear selected for{" "}
                <em className="italic text-gold-deep">shape, finish</em> and the
                way it carries a room.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-10">
                <p className="text-[0.85rem] leading-[1.75] text-ink/60">
                  Savvy Style is a Nigerian house for sneakers and considered
                  footwear. One tight edit, held to a standard, offered in ready
                  stock and by reservation.
                </p>
                <p className="text-[0.85rem] leading-[1.75] text-ink/60">
                  No endless aisles. Just the pairs worth the room they take up
                  — delivered across Lagos, Nigeria and internationally.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
