import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Savvy Style Nigeria about sizing, a pre-order or an order already placed.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-luxe py-12 lg:py-16">
          <p className="eyebrow text-gold-deep">Contact</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="text-page-title lg:col-span-7">
              Say{" "}
              <em className="italic text-gold-deep">hello</em>.
            </h1>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-ink/60 lg:col-span-4 lg:col-start-9 lg:pb-2">
              Sizing, a pre-order window, an order already placed — send a note
              and the house will read it.
            </p>
          </div>
        </div>
      </header>

      <div className="container-luxe grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border-t border-line pt-6">
            <h2 className="eyebrow text-stone">Direct</h2>
            {SITE.contactEmail || SITE.instagramUrl ? (
              <ul className="mt-4 space-y-3">
                {SITE.contactEmail ? (
                  <li>
                    <a
                      href={`mailto:${SITE.contactEmail}`}
                      className="link-underline text-[0.85rem] text-ink/70"
                    >
                      {SITE.contactEmail}
                    </a>
                  </li>
                ) : null}
                {SITE.instagramUrl ? (
                  <li>
                    <a
                      href={SITE.instagramUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-[0.85rem] text-ink/70"
                    >
                      Instagram ↗
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-4 text-[0.8rem] leading-relaxed text-ink/55">
                Direct contact details are being confirmed and will be published
                here. In this preview, the form is the reliable route.
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="eyebrow text-stone">Order questions</h2>
            <p className="mt-4 text-[0.8rem] leading-relaxed text-ink/55">
              Include the order reference if one has been issued. Pre-orders are
              allocated in the order payments are received.
            </p>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="eyebrow text-stone">Before you write</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/policies/delivery"
                  className="link-underline text-[0.8rem] text-ink/60"
                >
                  Delivery &amp; returns · draft
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/pre-orders"
                  className="link-underline text-[0.8rem] text-ink/60"
                >
                  Pre-order policy · draft
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="link-underline text-[0.8rem] text-ink/60"
                >
                  The collection
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
