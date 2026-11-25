import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-luxe">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:py-20">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Savvy Style home">
              <span className="block font-display text-[1.8rem] leading-none">
                {SITE.wordmark}
              </span>
              <span className="mt-1.5 block text-[0.5rem] uppercase tracking-[0.44em] text-stone">
                Nigeria
              </span>
            </Link>
            <p className="mt-6 max-w-xs font-display text-xl italic leading-snug text-ink/70">
              {SITE.tagline}.
            </p>
            <p className="mt-5 max-w-xs text-[0.78rem] leading-relaxed text-ink/55">
              Footwear selected for shape, finish and the way it carries a room.
              Delivered from Lagos.
            </p>
            <div className="mt-6 flex items-center gap-5">
              {SITE.instagramUrl ? (
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="eyebrow link-underline text-ink/70"
                >
                  Instagram ↗
                </a>
              ) : null}
              {SITE.contactEmail ? (
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="eyebrow link-underline text-ink/70"
                >
                  Email
                </a>
              ) : null}
              {!SITE.instagramUrl && !SITE.contactEmail ? (
                <Link href="/contact" className="eyebrow link-underline text-ink/70">
                  Contact
                </Link>
              ) : null}
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={FOOTER_NAV.shop}
            className="lg:col-span-2 lg:col-start-6"
          />
          <FooterColumn
            title="House"
            links={FOOTER_NAV.house}
            className="lg:col-span-2"
          />
          <FooterColumn
            title="Care"
            links={FOOTER_NAV.care}
            className="lg:col-span-2"
          />
        </div>

        <div className="border-t border-line py-4">
          <p className="flex flex-col gap-1 text-[0.65rem] leading-relaxed text-ink/45 sm:flex-row sm:items-center sm:gap-3">
            <span className="eyebrow shrink-0 text-gold-deep">Preview</span>
            <span>
              Product names, prices and photography are development fixtures,
              not current inventory. Imagery is credited in CREDITS.md.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-[0.6rem] uppercase tracking-[0.16em] text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {SITE.name}</p>
          <p>Prices in NGN · Display currencies indicative</p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="eyebrow text-stone">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="link-underline text-[0.8rem] text-ink/65 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
