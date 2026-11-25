import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/*
 * Fonts are self-hosted (SIL Open Font Licence) so previews and builds never
 * depend on a live Google Fonts request. See CREDITS.md.
 */
const serif = localFont({
  src: [
    {
      path: "../fonts/instrument-serif-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/instrument-serif-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "../fonts/instrument-sans-variable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument-sans",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Savvy Style Nigeria — Home to the classy",
    template: "%s — Savvy Style",
  },
  description:
    "A considered collection of sneakers and footwear from Savvy Style Nigeria. Ready stock and pre-orders, delivered across Lagos, Nigeria and worldwide.",
  applicationName: "Savvy Style Nigeria",
  keywords: [
    "Savvy Style",
    "Savvy Style Nigeria",
    "luxury sneakers Lagos",
    "footwear Nigeria",
    "premium sneakers",
    "sneaker pre-order Nigeria",
  ],
  authors: [{ name: "Savvy Style Nigeria" }],
  creator: "Savvy Style Nigeria",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Savvy Style Nigeria",
    title: "Savvy Style Nigeria — Home to the classy",
    description:
      "A considered collection of sneakers and footwear. Ready stock and pre-orders, delivered locally and internationally.",
    images: [
      {
        url: "/fixtures/products/regent-court.jpg",
        width: 1600,
        height: 1600,
        alt: "Savvy Style footwear preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Savvy Style Nigeria — Home to the classy",
    description:
      "A considered collection of sneakers and footwear. Ready stock and pre-orders, delivered locally and internationally.",
    images: ["/fixtures/products/regent-court.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
