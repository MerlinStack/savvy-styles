"use client";

import { useHydrated } from "@/lib/use-hydrated";
import { CURRENCY_CODES, CURRENCY_DEFINITIONS } from "@/modules/money";
import { useCurrencyStore } from "@/modules/currency/store";
import { cn } from "@/lib/cn";

interface CurrencySwitcherProps {
  tone?: "light" | "dark";
  className?: string;
}

export function CurrencySwitcher({
  tone = "light",
  className,
}: CurrencySwitcherProps) {
  const hydrated = useHydrated();
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const value = hydrated ? currency : "NGN";

  return (
    <label
      className={cn(
        "relative inline-flex items-center gap-1.5",
        tone === "dark" ? "text-paper/70" : "text-ink/60",
        className,
      )}
    >
      <span className="sr-only">Display currency</span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          if (
            CURRENCY_CODES.includes(
              next as (typeof CURRENCY_CODES)[number],
            )
          ) {
            setCurrency(next as (typeof CURRENCY_CODES)[number], {
              user: true,
            });
          }
        }}
        className={cn(
          "cursor-pointer appearance-none bg-transparent py-2 pr-4 text-[0.62rem] font-medium uppercase tracking-[0.18em] outline-none transition-colors",
          tone === "dark"
            ? "hover:text-paper focus-visible:text-paper"
            : "hover:text-ink focus-visible:text-ink",
        )}
        aria-label="Display currency"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code} className="bg-paper text-ink">
            {code}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[0.5rem]"
      >
        ▾
      </span>
      {hydrated && value !== "NGN" ? (
        <span className="sr-only">
          Prices shown in {CURRENCY_DEFINITIONS[value].label}. Payment settles in
          Naira.
        </span>
      ) : null}
    </label>
  );
}
