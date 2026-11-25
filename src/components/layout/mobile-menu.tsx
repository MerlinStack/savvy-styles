"use client";

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { MENU_NAV, SITE } from "@/lib/site";
import { useDialog } from "@/hooks/use-dialog";
import { CurrencySwitcher } from "./currency-switcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  savedCount: number;
}

export function MobileMenu({ open, onClose, savedCount }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useDialog({ open, onClose, panelRef });

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          className="fixed inset-0 z-50 lg:hidden"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-ink/45"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="relative flex h-full w-full flex-col overflow-y-auto bg-ink px-6 pb-8 pt-5 text-paper outline-none"
            initial={reduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-2xl leading-none">
                  {SITE.wordmark}
                </p>
                <p className="mt-1.5 text-[0.45rem] uppercase tracking-[0.44em] text-paper/45">
                  Nigeria
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-11 items-center justify-center border border-paper/20 text-paper transition-colors hover:bg-paper hover:text-ink"
                aria-label="Close menu"
              >
                <X aria-hidden="true" strokeWidth={1.4} className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-14 flex-1">
              <ul>
                {MENU_NAV.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.12 + index * 0.05,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-paper/12"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <span className="font-display text-[2rem] leading-none sm:text-[2.4rem]">
                        {item.label}
                      </span>
                      <span className="text-[0.55rem] tabular-nums tracking-[0.2em] text-paper/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 border-t border-paper/15 pt-6">
              <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.18em] text-paper/60">
                <CurrencySwitcher tone="dark" />
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="hover:text-paper"
                >
                  Wishlist{savedCount > 0 ? ` (${savedCount})` : ""}
                </Link>
              </div>

              {SITE.instagramUrl ? (
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-block text-[0.6rem] uppercase tracking-[0.18em] text-paper/60 hover:text-paper"
                >
                  Instagram ↗
                </a>
              ) : null}

              <p className="mt-8 font-display text-lg italic text-gold-light">
                {SITE.tagline}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
