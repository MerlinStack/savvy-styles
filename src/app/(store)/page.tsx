import type { Metadata } from "next";
import { Hero } from "@/components/storefront/hero";
import { HouseStatement } from "@/components/storefront/house-statement";
import { FeaturedEdit } from "@/components/storefront/featured-edit";
import { CategoryIndex } from "@/components/storefront/category-index";
import { PreOrderFeature } from "@/components/storefront/preorder-feature";
import { EditorialSplit } from "@/components/storefront/editorial-split";
import { NewsletterSection } from "@/components/storefront/newsletter-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HouseStatement />
      <FeaturedEdit />
      <CategoryIndex />
      <PreOrderFeature />
      <EditorialSplit />
      <NewsletterSection />
    </>
  );
}
