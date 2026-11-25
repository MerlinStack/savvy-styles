import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/modules/catalogue/queries";
import { cn } from "@/lib/cn";

const LAYOUT = [
  "col-span-2 lg:col-span-7",
  "col-span-2 lg:col-span-5 lg:pt-24",
  "col-span-1 lg:col-span-4",
  "col-span-1 lg:col-span-4 lg:pt-16",
  "col-span-2 lg:col-span-4 lg:pt-4",
];

export function FeaturedEdit() {
  const products = getFeaturedProducts(5);

  return (
    <section className="border-t border-line bg-paper">
      <div className="container-luxe section-pad">
        <SectionHeading
          eyebrow="The current edit"
          title={
            <>
              Selected, not{" "}
              <em className="italic text-gold-deep">collected</em>.
            </>
          }
          description="Five pieces holding the front of the collection — a court shoe, a runner, a loafer and the shapes between."
          action={{ href: "/shop", label: "All footwear" }}
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              className={cn(LAYOUT[index])}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 40vw"
              eager={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
