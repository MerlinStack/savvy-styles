import type { Product, ProductVariant } from "@/modules/catalogue/types";

export const PREORDER_STATES = [
  "PENDING_PAYMENT",
  "PAID",
  "AWAITING_STOCK",
  "STOCK_RECEIVED",
  "READY_FOR_DISPATCH",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type PreorderState = (typeof PREORDER_STATES)[number];

const PREORDER_TRANSITIONS: Record<PreorderState, readonly PreorderState[]> = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["AWAITING_STOCK", "CANCELLED"],
  AWAITING_STOCK: ["STOCK_RECEIVED", "CANCELLED"],
  STOCK_RECEIVED: ["READY_FOR_DISPATCH", "CANCELLED"],
  READY_FOR_DISPATCH: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export type PurchaseBlockReason =
  | "inactive-variant"
  | "out-of-stock"
  | "quantity-exceeds-stock"
  | "invalid-quantity";

export interface PurchaseCheck {
  purchasable: boolean;
  maxQuantity: number;
  reason?: PurchaseBlockReason;
}

/**
 * Fixture-level availability rules. The production equivalent lives in the
 * inventory service and re-checks inside a database transaction.
 */
export function checkPurchase(
  product: Product,
  variant: ProductVariant,
  requestedQuantity = 1,
): PurchaseCheck {
  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
    return { purchasable: false, maxQuantity: 0, reason: "invalid-quantity" };
  }

  if (!variant.active) {
    return {
      purchasable: false,
      maxQuantity: 0,
      reason: "inactive-variant",
    };
  }

  if (product.availability === "preorder") {
    const maxQuantity = 5;
    return requestedQuantity <= maxQuantity
      ? { purchasable: true, maxQuantity }
      : {
          purchasable: false,
          maxQuantity,
          reason: "quantity-exceeds-stock",
        };
  }

  if (variant.stock <= 0) {
    return { purchasable: false, maxQuantity: 0, reason: "out-of-stock" };
  }

  return requestedQuantity <= variant.stock
    ? { purchasable: true, maxQuantity: variant.stock }
    : {
        purchasable: false,
        maxQuantity: variant.stock,
        reason: "quantity-exceeds-stock",
      };
}

export function canTransitionPreorder(
  from: PreorderState,
  to: PreorderState,
): boolean {
  if (from === to) return false;
  return PREORDER_TRANSITIONS[from].includes(to);
}

export function assertPreorderTransition(
  from: PreorderState,
  to: PreorderState,
): void {
  if (!canTransitionPreorder(from, to)) {
    throw new Error(`Invalid pre-order transition: ${from} → ${to}`);
  }
}

export function isTerminalPreorderState(state: PreorderState): boolean {
  return state === "DELIVERED" || state === "CANCELLED";
}
