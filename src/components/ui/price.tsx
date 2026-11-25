"use client";

import { formatPrice } from "@/modules/money";
import { useCurrencyStore } from "@/modules/currency/store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/cn";

interface PriceProps {
  amountKobo: number;
  className?: string;
  showCode?: boolean;
}

/**
 * Renders the canonical NGN price during SSR and swaps to the customer's
 * display currency after hydration, avoiding a hydration mismatch.
 */
export function Price({
  amountKobo,
  className,
  showCode = false,
}: PriceProps) {
  const hydrated = useHydrated();
  const selectedCurrency = useCurrencyStore((state) => state.currency);
  const currency = hydrated ? selectedCurrency : "NGN";

  return (
    <span className={cn("tabular-nums", className)} data-currency={currency}>
      {formatPrice(amountKobo, currency)}
      {showCode ? (
        <span className="ml-1.5 text-[0.65em] tracking-[0.18em] text-stone">
          {currency}
        </span>
      ) : null}
    </span>
  );
}
