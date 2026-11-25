import type { Metadata } from "next";
import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces saved for later at Savvy Style Nigeria.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistContent />;
}
