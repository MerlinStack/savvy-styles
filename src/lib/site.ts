export const SITE = {
  name: "Savvy Style Nigeria",
  wordmark: "Savvy Style",
  tagline: "Home to the classy",
  description:
    "A considered collection of sneakers and footwear — ready stock and pre-orders, delivered across Lagos, Nigeria and worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  paymentCurrency: "NGN",
  /**
   * Optional links. These stay null until the owner confirms the real handles
   * and addresses; the interface never invents a contact destination.
   */
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || null,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
} as const;

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/new-arrivals", label: "New in" },
  { href: "/collections", label: "Collections" },
  { href: "/pre-orders", label: "Pre-orders" },
];

export const MENU_NAV: readonly NavItem[] = [
  { href: "/shop", label: "The collection" },
  { href: "/new-arrivals", label: "New arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/ready-stock", label: "Ready stock" },
  { href: "/pre-orders", label: "Pre-orders" },
  { href: "/about", label: "The house" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_NAV: {
  shop: NavItem[];
  house: NavItem[];
  care: NavItem[];
} = {
  shop: [
    { href: "/shop", label: "All footwear" },
    { href: "/new-arrivals", label: "New arrivals" },
    { href: "/ready-stock", label: "Ready stock" },
    { href: "/pre-orders", label: "Pre-orders" },
  ],
  house: [
    { href: "/about", label: "About Savvy Style" },
    { href: "/contact", label: "Contact" },
    { href: "/wishlist", label: "Wishlist" },
  ],
  care: [
    { href: "/policies/delivery", label: "Delivery & returns" },
    { href: "/policies/pre-orders", label: "Pre-order policy" },
    { href: "/policies/privacy", label: "Privacy" },
    { href: "/policies/terms", label: "Terms" },
  ],
};

export const ANNOUNCEMENTS = [
  "Lagos · Nationwide · Worldwide delivery",
  "Ready stock and fully paid pre-orders",
  "Home to the classy",
] as const;
