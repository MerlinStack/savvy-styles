"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById } from "@/modules/catalogue/queries";
import { checkPurchase } from "@/modules/inventory";
import type { CartLineInput } from "./totals";

interface AddResult {
  ok: boolean;
  reason?: string;
}

interface CartState {
  lines: CartLineInput[];
  addItem: (
    productId: string,
    variantId: string,
    quantity?: number,
  ) => AddResult;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => AddResult;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (productId, variantId, quantity = 1) => {
        const product = getProductById(productId);
        const variant = product?.variants.find((item) => item.id === variantId);

        if (!product || !variant) {
          return { ok: false, reason: "This item is no longer available." };
        }

        const existing = get().lines.find(
          (line) => line.variantId === variantId,
        );
        const nextQuantity = (existing?.quantity ?? 0) + quantity;
        const check = checkPurchase(product, variant, nextQuantity);

        if (!check.purchasable) {
          return {
            ok: false,
            reason:
              check.reason === "out-of-stock"
                ? "This size is currently unavailable."
                : `Only ${check.maxQuantity} available.`,
          };
        }

        set((state) => {
          const found = state.lines.find(
            (line) => line.variantId === variantId,
          );

          if (found) {
            return {
              lines: state.lines.map((line) =>
                line.variantId === variantId
                  ? { ...line, quantity: nextQuantity }
                  : line,
              ),
            };
          }

          return {
            lines: [
              ...state.lines,
              { productId, variantId, quantity: nextQuantity },
            ],
          };
        });

        return { ok: true };
      },

      removeItem: (variantId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.variantId !== variantId),
        })),

      setQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return { ok: true };
        }

        const line = get().lines.find((item) => item.variantId === variantId);
        if (!line) return { ok: false, reason: "Item not in bag." };

        const product = getProductById(line.productId);
        const variant = product?.variants.find(
          (item) => item.id === line.variantId,
        );

        if (!product || !variant) {
          get().removeItem(variantId);
          return { ok: false, reason: "This item is no longer available." };
        }

        const check = checkPurchase(product, variant, quantity);
        if (!check.purchasable) {
          return {
            ok: false,
            reason: `Only ${check.maxQuantity} available.`,
          };
        }

        set((state) => ({
          lines: state.lines.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        }));

        return { ok: true };
      },

      clear: () => set({ lines: [] }),
    }),
    {
      name: "savvy-style-cart",
      version: 1,
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function cartItemCount(lines: readonly CartLineInput[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}
