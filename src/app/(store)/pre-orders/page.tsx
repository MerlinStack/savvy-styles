import type { Metadata } from "next";
import { CollectionView } from "@/components/catalogue/collection-view";

export const metadata: Metadata = {
  title: "Pre-orders",
  description:
    "Reserve a pair before the next shipment lands. Pre-orders are fully paid and allocated in order of payment.",
  alternates: { canonical: "/pre-orders" },
};

export default function PreOrdersPage(props: PageProps<"/pre-orders">) {
  return (
    <CollectionView
      eyebrow="By reservation"
      title={
        <>
          Worth the{" "}
          <em className="italic text-gold-deep">wait</em>.
        </>
      }
      description="Pieces reserved in full before the shipment lands. Each window is shown on the product; allocation follows payment."
      searchParams={props.searchParams}
      path="/pre-orders"
      baseFilters={{ availability: "preorder" }}
      showAvailability={false}
    />
  );
}
