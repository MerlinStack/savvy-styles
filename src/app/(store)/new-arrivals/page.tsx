import type { Metadata } from "next";
import { CollectionView } from "@/components/catalogue/collection-view";

export const metadata: Metadata = {
  title: "New arrivals",
  description:
    "The latest additions to the Savvy Style edit — new sneakers and footwear, newest first.",
  alternates: { canonical: "/new-arrivals" },
};

export default function NewArrivalsPage(props: PageProps<"/new-arrivals">) {
  return (
    <CollectionView
      eyebrow="Just in"
      title={
        <>
          New <em className="italic text-gold-deep">arrivals</em>.
        </>
      }
      description="The most recent additions to the edit. Newest first, held to the same standard as everything else."
      searchParams={props.searchParams}
      path="/new-arrivals"
      baseFilters={{ newOnly: true }}
      defaultSort="newest"
    />
  );
}
