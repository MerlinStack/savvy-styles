import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/modules/catalogue/fixtures";
import { SITE } from "@/lib/site";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/shop", priority: 0.9 },
  { path: "/new-arrivals", priority: 0.8 },
  { path: "/ready-stock", priority: 0.8 },
  { path: "/pre-orders", priority: 0.8 },
  { path: "/collections", priority: 0.7 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/policies/delivery", priority: 0.3 },
  { path: "/policies/pre-orders", priority: 0.3 },
  { path: "/policies/privacy", priority: 0.3 },
  { path: "/policies/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((route) => ({
      url: new URL(route.path, SITE.url).toString(),
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...PRODUCTS.map((product) => ({
      url: new URL(`/product/${product.slug}`, SITE.url).toString(),
      lastModified: product.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
