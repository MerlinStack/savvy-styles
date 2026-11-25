import { describe, expect, it } from "vitest";
import {
  canTransitionPreorder,
  checkPurchase,
  assertPreorderTransition,
  isTerminalPreorderState,
  type PreorderState,
} from "@/modules/inventory";
import { getProductBySlug } from "@/modules/catalogue/queries";
import type { Product, ProductVariant } from "@/modules/catalogue/types";

function fixture(slug: string): Product {
  const product = getProductBySlug(slug);
  if (!product) throw new Error(`Missing fixture: ${slug}`);
  return product;
}

function variantOf(product: Product, size: string): ProductVariant {
  const variant = product.variants.find((entry) => entry.size === size);
  if (!variant) throw new Error(`Missing size ${size} on ${product.slug}`);
  return variant;
}

const ready = fixture("regent-court-low");
const preorder = fixture("aeon-runner");

describe("checkPurchase — ready stock", () => {
  it("allows a quantity within available stock", () => {
    const variant = variantOf(ready, "41");
    expect(variant.stock).toBe(4);
    expect(checkPurchase(ready, variant, 4)).toEqual({
      purchasable: true,
      maxQuantity: 4,
    });
  });

  it("blocks a quantity above available stock", () => {
    const variant = variantOf(ready, "41");
    expect(checkPurchase(ready, variant, 5)).toEqual({
      purchasable: false,
      maxQuantity: 4,
      reason: "quantity-exceeds-stock",
    });
  });

  it("blocks an out-of-stock size", () => {
    const soldOut = variantOf(ready, "43");
    expect(soldOut.stock).toBe(0);
    expect(checkPurchase(ready, soldOut, 1)).toEqual({
      purchasable: false,
      maxQuantity: 0,
      reason: "out-of-stock",
    });
  });

  it("blocks an inactive variant even when stock is present", () => {
    const variant = { ...variantOf(ready, "41"), active: false };
    expect(checkPurchase(ready, variant, 1)).toEqual({
      purchasable: false,
      maxQuantity: 0,
      reason: "inactive-variant",
    });
  });
});

describe("checkPurchase — pre-orders", () => {
  it("allows reservations despite zero physical stock", () => {
    const variant = variantOf(preorder, "42");
    expect(variant.stock).toBe(0);
    expect(checkPurchase(preorder, variant, 1)).toEqual({
      purchasable: true,
      maxQuantity: 5,
    });
  });

  it("caps a single pre-order line at five pairs", () => {
    const variant = variantOf(preorder, "42");
    expect(checkPurchase(preorder, variant, 5).purchasable).toBe(true);
    expect(checkPurchase(preorder, variant, 6)).toEqual({
      purchasable: false,
      maxQuantity: 5,
      reason: "quantity-exceeds-stock",
    });
  });

  it("still blocks an inactive pre-order variant", () => {
    const variant = { ...variantOf(preorder, "42"), active: false };
    expect(checkPurchase(preorder, variant, 1).reason).toBe("inactive-variant");
  });
});

describe("checkPurchase — quantities", () => {
  it.each([0, -1, 1.5, Number.NaN])(
    "rejects invalid quantity %s",
    (quantity) => {
      expect(checkPurchase(ready, variantOf(ready, "41"), quantity)).toEqual({
        purchasable: false,
        maxQuantity: 0,
        reason: "invalid-quantity",
      });
    },
  );

  it("defaults to a single pair", () => {
    expect(checkPurchase(ready, variantOf(ready, "41")).purchasable).toBe(true);
  });
});

describe("pre-order transitions", () => {
  const happyPath: PreorderState[] = [
    "PENDING_PAYMENT",
    "PAID",
    "AWAITING_STOCK",
    "STOCK_RECEIVED",
    "READY_FOR_DISPATCH",
    "DISPATCHED",
    "DELIVERED",
  ];

  it("allows each step of the fulfilment path", () => {
    for (let index = 0; index < happyPath.length - 1; index += 1) {
      expect(canTransitionPreorder(happyPath[index], happyPath[index + 1])).toBe(
        true,
      );
    }
  });

  it("rejects skipping ahead", () => {
    expect(canTransitionPreorder("PENDING_PAYMENT", "AWAITING_STOCK")).toBe(
      false,
    );
    expect(canTransitionPreorder("PAID", "DELIVERED")).toBe(false);
  });

  it("rejects self-transitions", () => {
    expect(canTransitionPreorder("PAID", "PAID")).toBe(false);
  });

  it("allows cancellation until dispatch, then stops", () => {
    expect(canTransitionPreorder("PAID", "CANCELLED")).toBe(true);
    expect(canTransitionPreorder("READY_FOR_DISPATCH", "CANCELLED")).toBe(true);
    expect(canTransitionPreorder("DISPATCHED", "CANCELLED")).toBe(false);
    expect(canTransitionPreorder("CANCELLED", "PAID")).toBe(false);
  });

  it("treats delivered and cancelled as terminal", () => {
    expect(isTerminalPreorderState("DELIVERED")).toBe(true);
    expect(isTerminalPreorderState("CANCELLED")).toBe(true);
    expect(isTerminalPreorderState("PAID")).toBe(false);
  });

  it("throws from the asserting helper on an invalid move", () => {
    expect(() => assertPreorderTransition("PAID", "DELIVERED")).toThrow(
      "Invalid pre-order transition: PAID → DELIVERED",
    );
    expect(() =>
      assertPreorderTransition("PAID", "AWAITING_STOCK"),
    ).not.toThrow();
  });
});
