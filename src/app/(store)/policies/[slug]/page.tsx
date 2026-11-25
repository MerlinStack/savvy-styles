import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { POLICIES, getPolicy, type PolicySlug } from "@/modules/policies/content";

type PolicyPageProps = PageProps<"/policies/[slug]">;

export function generateStaticParams() {
  return (Object.keys(POLICIES) as PolicySlug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) notFound();

  return {
    title: `${policy.title} (draft)`,
    description: policy.summary,
    alternates: { canonical: `/policies/${policy.slug}` },
    robots: { index: false, follow: false },
  };
}

export default function PolicyPage(props: PolicyPageProps) {
  return (
    <Suspense fallback={<PolicyFallback />}>
      <PolicyDetail params={props.params} />
    </Suspense>
  );
}

async function PolicyDetail({ params }: Pick<PolicyPageProps, "params">) {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) {
    notFound();
  }

  return (
    <>
      <header className="border-b border-line">
        <div className="container-luxe py-12 lg:py-16">
          <p className="eyebrow text-gold-deep">Policy · draft</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="text-page-title lg:col-span-7">{policy.title}</h1>
            <p className="max-w-sm text-[0.85rem] leading-relaxed text-ink/60 lg:col-span-4 lg:col-start-9 lg:pb-2">
              {policy.summary}
            </p>
          </div>
        </div>
      </header>

      <div className="container-luxe grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <aside className="lg:col-span-3">
          <p className="eyebrow text-stone">Policies</p>
          <nav aria-label="Policies" className="mt-4">
            <ul className="space-y-2.5">
              {(Object.keys(POLICIES) as PolicySlug[]).map((entry) => (
                <li key={entry}>
                  <Link
                    href={`/policies/${entry}`}
                    aria-current={entry === policy.slug ? "page" : undefined}
                    className={
                      entry === policy.slug
                        ? "text-[0.8rem] text-ink"
                        : "text-[0.8rem] text-ink/45 transition-colors hover:text-ink"
                    }
                  >
                    {POLICIES[entry].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-8 max-w-[15rem] text-[0.7rem] leading-relaxed text-ink/40">
            These pages are drafts. They exist so the structure can be reviewed
            before the owner approves final wording.
          </p>
        </aside>

        <article className="lg:col-span-7 lg:col-start-5">
          <div className="border border-gold-deep/25 bg-gold/8 px-4 py-3 text-[0.72rem] leading-relaxed text-gold-deep">
            <span className="font-medium uppercase tracking-[0.16em]">
              Draft.
            </span>{" "}
            {policy.summary} Nothing here constitutes a final policy.
          </div>

          <div className="mt-8">
            {policy.sections.map((section, index) => (
              <section
                key={section.heading}
                className="border-t border-line py-7 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.6rem] tabular-nums tracking-[0.18em] text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl leading-tight">
                    {section.heading}
                  </h2>
                </div>
                <div className="mt-3 space-y-3 pl-8">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 32)}
                      className="text-[0.84rem] leading-[1.8] text-ink/60"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
            <Link href="/contact" className="eyebrow link-underline text-ink">
              Ask a question
            </Link>
            <Link
              href="/policies/delivery"
              className="eyebrow link-underline text-ink/55"
            >
              Delivery &amp; returns
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}

function PolicyFallback() {
  return (
    <div className="container-luxe py-16" aria-busy="true">
      <div className="h-2.5 w-24 animate-pulse bg-sand" />
      <div className="mt-5 h-12 w-2/3 animate-pulse bg-sand" />
      <div className="mt-10 h-64 max-w-2xl animate-pulse bg-sand/50" />
    </div>
  );
}
