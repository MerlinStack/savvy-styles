import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link href="/" aria-label="Savvy Style home" className="mb-12">
        <span className="block font-display text-3xl leading-none">
          Savvy Style
        </span>
        <span className="mt-2 block text-[0.5rem] uppercase tracking-[0.44em] text-stone">
          Nigeria
        </span>
      </Link>
      <p className="eyebrow text-gold-deep">404</p>
      <h1 className="mt-5 font-display text-5xl leading-none sm:text-6xl">
        Not on the page.
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/55">
        That address does not belong to the house. Return to the collection and
        begin again.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          Shop
        </ButtonLink>
      </div>
    </div>
  );
}
