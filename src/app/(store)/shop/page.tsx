import type { Metadata } from "next";
import { CollectionView } from "@/components/catalogue/collection-view";

export const metadata: Metadata = {
  title: "Shop all footwear",
  description:
    "Browse the full Savvy Style collection — ready stock and fully paid pre-orders, delivered across Lagos, Nigeria and internationally.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <CollectionView
      eyebrow="The collection"
      title={
        <>
          Footwear, <em className="italic text-gold-deep">considered</em>.
        </>
      }
      description="Every piece in the current edit. Filter by form, size or availability, or search for a colour."
      searchParams={props.searchParams}
      path="/shop"
    />
  );
}
