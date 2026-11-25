"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { useUiStore } from "@/modules/ui/store";
import { getAllProducts } from "@/modules/catalogue/queries";
import { formatNgn } from "@/modules/money";

export function SearchDialog() {
  const open = useUiStore((state) => state.searchOpen);
  const closeSearch = useUiStore((state) => state.closeSearch);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");

  const closeAndReset = useCallback(() => {
    setQuery("");
    closeSearch();
  }, [closeSearch]);

  useDialog({
    open,
    onClose: closeAndReset,
    panelRef,
    initialFocusRef: inputRef,
  });

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return getAllProducts()
      .filter((product) =>
        [
          product.name,
          product.subtitle,
          product.category,
          product.audience,
          ...product.variants.map((variant) => variant.colour),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="search"
          className="fixed inset-0 z-50"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            onClick={closeAndReset}
            aria-label="Close search"
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the collection"
            tabIndex={-1}
            className="relative mx-auto mt-0 w-full max-w-3xl bg-paper px-5 pb-8 pt-5 outline-none sm:mt-24 sm:px-8 sm:pb-10 sm:pt-7"
            initial={reduceMotion ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <p className="eyebrow text-stone">Search</p>
              <button
                type="button"
                onClick={closeAndReset}
                className="inline-flex size-10 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                aria-label="Close search"
              >
                <X aria-hidden="true" strokeWidth={1.4} className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 border-b border-ink/20 pb-4">
              <Search
                aria-hidden="true"
                strokeWidth={1.4}
                className="size-5 shrink-0 text-ink/45"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search by name, colour or form"
                className="w-full appearance-none bg-transparent font-display text-xl text-ink outline-none placeholder:text-stone/80 sm:text-2xl"
                aria-label="Search products"
              />
            </div>

            <div className="mt-6 min-h-24">
              {query.trim() === "" ? (
                <div>
                  <p className="text-sm text-ink/55">
                    Start typing, or jump straight to a part of the collection.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      { href: "/ready-stock", label: "Ready stock" },
                      { href: "/pre-orders", label: "Pre-orders" },
                      { href: "/new-arrivals", label: "New arrivals" },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeAndReset}
                        className="link-underline eyebrow text-ink/70"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="text-sm text-ink/60">
                  Nothing matches “{query.trim()}” yet.{" "}
                  <Link
                    href="/shop"
                    onClick={closeAndReset}
                    className="link-underline text-ink"
                  >
                    Browse the full collection
                  </Link>
                  .
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeAndReset}
                        className="group flex items-center gap-4 py-3"
                      >
                        <span className="relative block h-[74px] w-16 shrink-0 overflow-hidden bg-sand">
                          <Image
                            src={product.images[0].src}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                            style={{
                              objectPosition:
                                product.images[0].position ?? "center",
                            }}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg leading-tight">
                            {product.name}
                          </span>
                          <span className="mt-1 block truncate text-[0.65rem] uppercase tracking-[0.14em] text-stone">
                            {product.subtitle}
                          </span>
                        </span>
                        <span className="shrink-0 text-[0.78rem] tabular-nums text-ink/70">
                          {formatNgn(product.basePriceKobo)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
