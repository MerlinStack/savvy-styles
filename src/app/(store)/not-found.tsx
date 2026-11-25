import { ButtonLink } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <div className="container-luxe py-20 lg:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-gold-deep">404 · Off the edit</p>
        <h1 className="text-page-title mt-5">
          A quiet{" "}
          <em className="italic text-gold-deep">corner</em>.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-ink/55">
          This page is not part of the collection. The piece may have moved, or
          the address may be incomplete.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">Browse the collection</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Return home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
