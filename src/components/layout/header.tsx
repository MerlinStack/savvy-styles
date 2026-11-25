"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { PRIMARY_NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";
import { cartItemCount } from "@/modules/cart/store";
import { useCartStore } from "@/modules/cart/store";
import { useWishlistStore } from "@/modules/wishlist/store";
import { useUiStore } from "@/modules/ui/store";
import { AnnouncementBar } from "./announcement-bar";
import { CurrencySwitcher } from "./currency-switcher";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartLines = useCartStore((state) => state.lines);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const openCart = useUiStore((state) => state.openCart);
  const openSearch = useUiStore((state) => state.openSearch);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnHistory = () => setMenuOpen(false);
    window.addEventListener("popstate", closeOnHistory);
    return () => window.removeEventListener("popstate", closeOnHistory);
  }, []);

  const bagCount = hydrated ? cartItemCount(cartLines) : 0;
  const savedCount = hydrated ? wishlistCount : 0;

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />

      <div
        className={cn(
          "border-b bg-ivory transition-colors duration-300",
          scrolled
            ? "border-line/80 bg-ivory/95 backdrop-blur-md"
            : "border-transparent",
        )}
      >
        <div className="container-luxe">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 md:h-20">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 lg:flex"
            >
              {PRIMARY_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-[0.64rem] font-medium uppercase tracking-[0.2em] transition-colors duration-200",
                      active
                        ? "text-ink"
                        : "text-ink/55 hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "border-b pb-1",
                        active
                          ? "border-gold"
                          : "border-transparent hover:border-line",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <Menu aria-hidden="true" strokeWidth={1.4} className="size-5" />
            </button>

            <Link
              href="/"
              aria-label={`${SITE.name} — home`}
              className="justify-self-center text-center"
            >
              <span className="block font-display text-[1.5rem] leading-none tracking-[0.005em] md:text-[1.7rem]">
                {SITE.wordmark}
              </span>
              <span className="mt-1.5 block text-[0.45rem] uppercase tracking-[0.44em] text-stone md:text-[0.5rem]">
                Nigeria
              </span>
            </Link>

            <div className="flex items-center justify-end gap-0.5">
              <CurrencySwitcher className="mr-1 hidden sm:inline-flex" />

              <button
                type="button"
                onClick={openSearch}
                className="inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-gold-deep"
                aria-label="Search the collection"
              >
                <Search
                  aria-hidden="true"
                  strokeWidth={1.4}
                  className="size-[18px]"
                />
              </button>

              <Link
                href="/wishlist"
                className="relative hidden size-10 items-center justify-center text-ink transition-colors hover:text-gold-deep sm:inline-flex"
                aria-label={
                  savedCount > 0
                    ? `Wishlist, ${savedCount} saved`
                    : "Wishlist"
                }
              >
                <Heart
                  aria-hidden="true"
                  strokeWidth={1.4}
                  className={cn("size-[18px]", savedCount > 0 && "fill-current")}
                />
                {savedCount > 0 ? (
                  <span className="absolute right-0.5 top-1 text-[0.55rem] tabular-nums">
                    {savedCount}
                  </span>
                ) : null}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="inline-flex h-10 items-center gap-2 px-2 text-ink transition-colors hover:text-gold-deep"
                aria-label={
                  bagCount > 0 ? `Open bag, ${bagCount} items` : "Open bag"
                }
              >
                <ShoppingBag
                  aria-hidden="true"
                  strokeWidth={1.4}
                  className="size-[18px]"
                />
                <span className="hidden text-[0.62rem] uppercase tracking-[0.18em] md:inline">
                  Bag
                </span>
                <span className="text-[0.62rem] tabular-nums md:hidden">
                  {bagCount > 0 ? `(${bagCount})` : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        savedCount={savedCount}
      />
    </header>
  );
}
