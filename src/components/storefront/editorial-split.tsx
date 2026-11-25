import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EDITORIAL_IMAGES } from "@/modules/catalogue/fixtures";
import { ParallaxMedia } from "./parallax-media";

export function EditorialSplit() {
  return (
    <section className="section-pad bg-paper">
      <div className="container-luxe grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
        <Reveal className="lg:col-span-7">
          <ParallaxMedia
            src={EDITORIAL_IMAGES.campaign.src}
            alt={EDITORIAL_IMAGES.campaign.alt}
            className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3]"
          />
        </Reveal>

        <div className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow text-gold-deep">The art of arrival</p>
          <h2 className="text-section-title mt-4">
            A quieter kind of{" "}
            <em className="italic text-gold-deep">presence</em>.
          </h2>
          <p className="mt-5 text-[0.88rem] leading-relaxed text-ink/60">
            The right shoe does not ask for attention. It changes the line of a
            trouser, the pace of a walk, the way a room is entered. That is the
            standard every piece here is held to.
          </p>
          <p className="mt-4 text-[0.88rem] leading-relaxed text-ink/60">
            Browse by form, or start with what is ready to leave the studio
            today.
          </p>
          <ButtonLink href="/collections" variant="secondary" className="mt-7">
            See the collections
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
