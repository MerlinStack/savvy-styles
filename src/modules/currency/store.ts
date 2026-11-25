"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode } from "@/modules/money";

interface CurrencyState {
  currency: CurrencyCode;
  hasUserSelected: boolean;
  setCurrency: (currency: CurrencyCode, options?: { user?: boolean }) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "NGN",
      hasUserSelected: false,
      setCurrency: (currency, options) =>
        set({
          currency,
          hasUserSelected: options?.user ?? false,
        }),
    }),
    {
      name: "savvy-style-currency",
      version: 1,
    },
  ),
);
