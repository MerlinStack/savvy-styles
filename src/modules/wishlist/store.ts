"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const exists = get().productIds.includes(productId);
        set({
          productIds: exists
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId],
        });
      },
      remove: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "savvy-style-wishlist",
      version: 1,
      partialize: (state) => ({ productIds: state.productIds }),
    },
  ),
);
