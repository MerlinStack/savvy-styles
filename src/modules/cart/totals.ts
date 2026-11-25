import type { Product, ProductVariant } from "@/modules/catalogue/types";
import { checkPurchase } from "@/modules/inventory";

export interface CartLineInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface PricedCartLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPriceKobo: number;
  lineTotalKobo: number;
  available: boolean;
  issue?: string;
}

export interface CartSummary {
  lines: PricedCartLine[];
  subtotalKobo: number;
  itemCount: number;
  hasIssues: boolean;
}

/**
 * Prices are always derived from the catalogue, never trusted from the client
 * cart payload. The checkout route repeats this calculation server-side.
 */
export function summarizeCart(
  lines: readonly CartLineInput[],
  products: readonly Product[],
): CartSummary {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const pricedLines: PricedCartLine[] = [];

  for (const line of lines) {
    const product = productsById.get(line.productId);
    if (!product) continue;

    const variant = product.variants.find(
      (candidate) => candidate.id === line.variantId,
    );
    if (!variant) continue;

    const quantity = Math.max(0, Math.floor(line.quantity));
    const purchase = checkPurchase(product, variant, quantity);

    pricedLines.push({
      product,
      variant,
      quantity,
      unitPriceKobo: product.basePriceKobo,
      lineTotalKobo: product.basePriceKobo * quantity,
      available: purchase.purchasable,
      issue: purchase.reason,
    });
  }

  const subtotalKobo = pricedLines.reduce(
    (total, line) => total + line.lineTotalKobo,
    0,
  );

  return {
    lines: pricedLines,
    subtotalKobo,
    itemCount: pricedLines.reduce((total, line) => total + line.quantity, 0),
    hasIssues: pricedLines.some((line) => !line.available),
  };
}

export function cartSubtotalKobo(
  lines: readonly CartLineInput[],
  products: readonly Product[],
): number {
  return summarizeCart(lines, products).subtotalKobo;
}
