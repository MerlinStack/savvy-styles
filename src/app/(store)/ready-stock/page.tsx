import type { Metadata } from "next";
import { CollectionView } from "@/components/catalogue/collection-view";

export const metadata: Metadata = {
  title: "Ready stock",
  description:
    "Pieces in hand and ready to dispatch from Lagos, with live size availability.",
  alternates: { canonical: "/ready-stock" },
};

export default function ReadyStockPage(props: PageProps<"/ready-stock">) {
  return (
    <CollectionView
      eyebrow="In hand"
      title={
        <>
          Ready to{" "}
          <em className="italic text-gold-deep">dispatch</em>.
        </>
      }
      description="Pieces in hand now. Sizes shown are the ones currently available to leave the studio."
      searchParams={props.searchParams}
      path="/ready-stock"
      baseFilters={{ availability: "ready" }}
      showAvailability={false}
    />
  );
}
