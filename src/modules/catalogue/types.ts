export const CATEGORY_SLUGS = [
  "lifestyle",
  "performance",
  "casual",
  "formal",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Audience = "men" | "women" | "unisex";

export type AvailabilityMode = "ready" | "preorder";

export interface ProductImage {
  src: string;
  alt: string;
  /** CSS object-position for editorial cropping. */
  position?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  colour: string;
  sku: string;
  /** On-hand ready stock. Pre-order variants always report 0. */
  stock: number;
  active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  category: CategorySlug;
  audience: Audience;
  availability: AvailabilityMode;
  /** Canonical price in NGN kobo. */
  basePriceKobo: number;
  /** Only meaningful for pre-order products. */
  preorderEta?: string;
  images: ProductImage[];
  materials: string[];
  care: string;
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  createdAt: string;
  seo: {
    title: string;
    description: string;
  };
  variants: ProductVariant[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: ProductImage;
}

export type CatalogueSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name";

export interface CatalogueFilters {
  query?: string;
  categories?: CategorySlug[];
  sizes?: string[];
  availability?: AvailabilityMode | "all";
  audience?: Audience | "all";
  minPriceKobo?: number;
  maxPriceKobo?: number;
  sort?: CatalogueSort;
  /** Internal preset used by the new-arrivals view. Never read from the URL. */
  newOnly?: boolean;
}
