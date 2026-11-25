import { describe, expect, it } from "vitest";
import {
  cartSubtotalKobo,
  summarizeCart,
  type CartLineInput,
} from "@/modules/cart/totals";
import { getProductBySlug } from "@/modules/catalogue/queries";
import type { Product } from "@/modules/catalogue/types";

function fixture(slug: string): Product {
  const product = getProductBySlug(slug);
  if (!product) throw new Error(`Missing fixture: ${slug}`);
  return product;
}

const regent = fixture("regent-court-low");
const aeon = fixture("aeon-runner");

function variant(product: Product, size: string) {
  const match = product.variants.find((entry) => entry.size === size);
  if (!match) throw new Error(`Missing size ${size}`);
  return match;
}

const regent41 = variant(regent, "41");

function line(product: Product, size: string, quantity: number): CartLineInput {
  return {
    productId: product.id,
    variantId: variant(product, size).id,
    quantity,
  };
}

describe("summarizeCart", () => {
  it("prices lines from the catalogue, not from client input", () => {
    const summary = summarizeCart(
      [
        {
          productId: regent.id,
          variantId: regent41.id,
          quantity: 2,
          // Extra fields on the payload must be ignored.
          unitPriceKobo: 1,
        } as CartLineInput,
      ],
      [regent],
    );

    expect(summary.lines).toHaveLength(1);
    expect(summary.lines[0].unitPriceKobo).toBe(regent.basePriceKobo);
    expect(summary.lines[0].lineTotalKobo).toBe(regent.basePriceKobo * 2);
    expect(summary.subtotalKobo).toBe(regent.basePriceKobo * 2);
    expect(summary.itemCount).toBe(2);
    expect(summary.hasIssues).toBe(false);
  });

  it("sums multiple lines", () => {
    const summary = summarizeCart(
      [line(regent, "41", 2), line(aeon, "42", 1)],
      [regent, aeon],
    );

    expect(summary.itemCount).toBe(3);
    expect(summary.subtotalKobo).toBe(
      regent.basePriceKobo * 2 + aeon.basePriceKobo,
    );
  });

  it("flags a line whose quantity exceeds stock", () => {
    const summary = summarizeCart([line(regent, "41", 5)], [regent]);
    expect(summary.lines[0].available).toBe(false);
    expect(summary.lines[0].issue).toBe("quantity-exceeds-stock");
    expect(summary.hasIssues).toBe(true);
  });

  it("flags a sold-out size", () => {
    const summary = summarizeCart([line(regent, "43", 1)], [regent]);
    expect(summary.lines[0].available).toBe(false);
    expect(summary.lines[0].issue).toBe("out-of-stock");
    expect(summary.hasIssues).toBe(true);
  });

  it("keeps an invalid zero quantity as an issue rather than hiding it", () => {
    const summary = summarizeCart([line(regent, "41", 0)], [regent]);
    expect(summary.lines).toHaveLength(1);
    expect(summary.lines[0].quantity).toBe(0);
    expect(summary.lines[0].issue).toBe("invalid-quantity");
    expect(summary.hasIssues).toBe(true);
  });

  it("floors fractional quantities", () => {
    const summary = summarizeCart([line(regent, "41", 2.9)], [regent]);
    expect(summary.lines[0].quantity).toBe(2);
    expect(summary.lines[0].lineTotalKobo).toBe(regent.basePriceKobo * 2);
  });

  it("allows pre-order reservations priced at the catalogue base", () => {
    const summary = summarizeCart([line(aeon, "42", 2)], [aeon]);
    expect(summary.lines[0].available).toBe(true);
    expect(summary.lines[0].lineTotalKobo).toBe(aeon.basePriceKobo * 2);
    expect(summary.hasIssues).toBe(false);
  });

  it("ignores unknown products and variants", () => {
    const summary = summarizeCart(
      [
        { productId: "not-a-product", variantId: "x", quantity: 1 },
        { productId: regent.id, variantId: "not-a-variant", quantity: 1 },
        line(regent, "41", 1),
      ],
      [regent, aeon],
    );

    expect(summary.lines).toHaveLength(1);
    expect(summary.itemCount).toBe(1);
    expect(summary.subtotalKobo).toBe(regent.basePriceKobo);
  });

  it("returns an empty, issue-free summary for an empty cart", () => {
    expect(summarizeCart([], [regent])).toEqual({
      lines: [],
      subtotalKobo: 0,
      itemCount: 0,
      hasIssues: false,
    });
  });
});

describe("cartSubtotalKobo", () => {
  it("matches the full summary subtotal", () => {
    const lines = [line(regent, "41", 2), line(aeon, "42", 1)];
    expect(cartSubtotalKobo(lines, [regent, aeon])).toBe(
      summarizeCart(lines, [regent, aeon]).subtotalKobo,
    );
  });
});
