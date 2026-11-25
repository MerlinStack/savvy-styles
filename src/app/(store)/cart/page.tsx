import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageContent />;
}
