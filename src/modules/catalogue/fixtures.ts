import { nairaToKobo } from "@/modules/money";
import type {
  Category,
  Product,
  ProductVariant,
  CategorySlug,
  AvailabilityMode,
} from "./types";

/**
 * DEVELOPMENT FIXTURES — NOT REAL INVENTORY.
 *
 * Names, prices, stock levels and fulfilment windows are sample data used to
 * exercise the storefront. They must be replaced with owner-supplied catalogue
 * data before launch. Imagery is credited in CREDITS.md.
 */

const IMG = {
  regent: "/fixtures/products/regent-court.jpg",
  aeon: "/fixtures/products/aeon-runner.jpg",
  atelier: "/fixtures/products/atelier-court.jpg",
  midnight: "/fixtures/products/midnight-runner.jpg",
  archive: "/fixtures/products/archive-350.jpg",
  highland: "/fixtures/products/highland-low.jpg",
  sienna: "/fixtures/products/sienna-loafer.jpg",
  oxford: "/fixtures/products/oxford-house.jpg",
  canvas: "/fixtures/products/canvas-70.jpg",
  urban: "/fixtures/products/urban-high.jpg",
  campaign: "/fixtures/products/campaign-street.jpg",
  editorial: "/fixtures/products/editorial-canvas.jpg",
} as const;

function makeVariants(
  productId: string,
  colourCode: string,
  colour: string,
  availability: AvailabilityMode,
  sizesAndStock: Array<[size: string, stock: number]>,
): ProductVariant[] {
  return sizesAndStock.map(([size, stock]) => ({
    id: `${productId}-${colourCode}-${size.replace(/\s+/g, "")}`,
    size,
    colour,
    sku: `SVY-${productId.toUpperCase()}-${colourCode}-${size.replace(/\s+/g, "")}`,
    stock: availability === "preorder" ? 0 : stock,
    active: true,
  }));
}

export const PRODUCTS: Product[] = [
  {
    id: "regent",
    slug: "regent-court-low",
    name: "Regent Court Low",
    subtitle: "Smoke grey · Gum sole",
    description:
      "A low-profile court silhouette in brushed smoke leather, finished with a honey gum sole and a deliberately quiet profile. Built to move between tailored and relaxed without announcing itself.",
    story:
      "Selected for its proportion: a low collar, a clean toe box and just enough contrast at the sole. The kind of shoe that improves with wear.",
    category: "lifestyle",
    audience: "unisex",
    availability: "ready",
    basePriceKobo: nairaToKobo(185_000),
    images: [
      {
        src: IMG.regent,
        alt: "Regent Court Low in smoke grey against a charcoal backdrop",
        position: "center",
      },
      {
        src: IMG.regent,
        alt: "Detail of the Regent Court Low leather upper",
        position: "62% 42%",
      },
    ],
    materials: ["Brushed leather upper", "Gum rubber outsole", "Textile lining"],
    care: "Brush after wear. Keep away from prolonged moisture and direct heat.",
    featured: true,
    isNew: true,
    bestSeller: true,
    createdAt: "2026-11-18T10:00:00.000Z",
    seo: {
      title: "Regent Court Low — Smoke Grey",
      description:
        "A low-profile leather court sneaker with a honey gum sole, selected by Savvy Style Nigeria.",
    },
    variants: makeVariants("regent", "SGR", "Smoke grey", "ready", [
      ["40", 2],
      ["41", 4],
      ["42", 1],
      ["43", 0],
      ["44", 3],
      ["45", 2],
    ]),
  },
  {
    id: "aeon",
    slug: "aeon-runner",
    name: "Aeon Runner",
    subtitle: "Bone · Ember",
    description:
      "A sculpted performance runner in bone and ember. Layered mesh, a stable heel and a foam midsole make it as considered underfoot as it is in profile.",
    story:
      "The Aeon is part of the next arrival — reserved in full and delivered when the shipment lands. Its shape is technical; its palette is not.",
    category: "performance",
    audience: "unisex",
    availability: "preorder",
    basePriceKobo: nairaToKobo(160_000),
    preorderEta: "3–5 weeks (sample window)",
    images: [
      {
        src: IMG.aeon,
        alt: "Aeon Runner concept shoe in bone and ember on a pale background",
        position: "center",
      },
      {
        src: IMG.aeon,
        alt: "Side profile detail of the Aeon Runner",
        position: "58% 50%",
      },
    ],
    materials: ["Engineered mesh", "Foam midsole", "Rubber outsole"],
    care: "Spot clean with a soft damp cloth. Air dry away from direct sunlight.",
    featured: true,
    isNew: true,
    bestSeller: false,
    createdAt: "2026-11-22T09:00:00.000Z",
    seo: {
      title: "Aeon Runner — Bone / Ember Pre-Order",
      description:
        "Aeon Runner in bone and ember, available by fully paid pre-order through Savvy Style Nigeria.",
    },
    variants: makeVariants("aeon", "BEM", "Bone / Ember", "preorder", [
      ["40", 0],
      ["41", 0],
      ["42", 0],
      ["43", 0],
      ["44", 0],
      ["45", 0],
      ["46", 0],
    ]),
  },
  {
    id: "atelier",
    slug: "atelier-court",
    name: "Atelier Court",
    subtitle: "Ivory · Monochrome",
    description:
      "An all-ivory court shoe with a narrow last and a softly padded collar. Understated, clean and easy to wear with almost everything.",
    story:
      "A wardrobe shoe in the truest sense. The monochrome palette keeps the line long; the matte finish keeps it grounded.",
    category: "lifestyle",
    audience: "women",
    availability: "ready",
    basePriceKobo: nairaToKobo(145_000),
    images: [
      {
        src: IMG.atelier,
        alt: "Atelier Court sneakers in ivory on a pale surface",
        position: "center",
      },
      {
        src: IMG.atelier,
        alt: "Close crop of the Atelier Court upper and laces",
        position: "48% 38%",
      },
    ],
    materials: ["Smooth leather upper", "Rubber cupsole", "Cotton laces"],
    care: "Wipe with a soft dry cloth. Use a neutral leather conditioner sparingly.",
    featured: true,
    isNew: true,
    bestSeller: false,
    createdAt: "2026-11-15T11:30:00.000Z",
    seo: {
      title: "Atelier Court — Ivory",
      description:
        "An all-ivory leather court sneaker with a narrow last, curated by Savvy Style Nigeria.",
    },
    variants: makeVariants("atelier", "IVR", "Ivory", "ready", [
      ["36", 2],
      ["37", 3],
      ["38", 1],
      ["39", 0],
      ["40", 2],
      ["41", 1],
    ]),
  },
  {
    id: "midnight",
    slug: "midnight-runner",
    name: "Midnight Runner",
    subtitle: "Black · Bone",
    description:
      "A monochrome runner with a bone sole and a close, city-ready shape. Light enough for the day, quiet enough for the evening.",
    story:
      "The Midnight is an exercise in contrast: a deep upper, a pale sole and nothing else competing for attention.",
    category: "performance",
    audience: "men",
    availability: "ready",
    basePriceKobo: nairaToKobo(175_000),
    images: [
      {
        src: IMG.midnight,
        alt: "Midnight Runner sneakers in black and bone on a dark surface",
        position: "center",
      },
      {
        src: IMG.midnight,
        alt: "Detail of the Midnight Runner midsole",
        position: "52% 62%",
      },
    ],
    materials: ["Knit upper", "EVA midsole", "Rubber outsole"],
    care: "Hand wash cold with a soft brush. Air dry naturally.",
    featured: false,
    isNew: false,
    bestSeller: true,
    createdAt: "2026-10-28T08:45:00.000Z",
    seo: {
      title: "Midnight Runner — Black / Bone",
      description:
        "A lightweight monochrome runner in black and bone, selected by Savvy Style Nigeria.",
    },
    variants: makeVariants("midnight", "BBO", "Black / Bone", "ready", [
      ["41", 1],
      ["42", 2],
      ["43", 3],
      ["44", 0],
      ["45", 2],
      ["46", 1],
    ]),
  },
  {
    id: "archive",
    slug: "archive-350",
    name: "Archive 350",
    subtitle: "Static · Seasonal reservation",
    description:
      "A sculpted, sock-fit silhouette with a layered upper and a translucent sole. Released in a limited run and offered here by reservation.",
    story:
      "The Archive is the piece people ask about after they have seen it in person. Reserved in full; allocated in order of payment.",
    category: "lifestyle",
    audience: "unisex",
    availability: "preorder",
    basePriceKobo: nairaToKobo(220_000),
    preorderEta: "4–6 weeks (sample window)",
    images: [
      {
        src: IMG.archive,
        alt: "Archive 350 sneaker in static grey on a dark background",
        position: "center",
      },
      {
        src: IMG.archive,
        alt: "Close detail of the Archive 350 knit upper",
        position: "45% 55%",
      },
    ],
    materials: ["Primeknit-style upper", "Boost-style foam", "Translucent rubber"],
    care: "Spot clean only. Store with shoe trees away from heat.",
    featured: true,
    isNew: false,
    bestSeller: true,
    createdAt: "2026-11-24T07:00:00.000Z",
    seo: {
      title: "Archive 350 — Static Pre-Order",
      description:
        "Archive 350 in static grey, available by fully paid pre-order through Savvy Style Nigeria.",
    },
    variants: makeVariants("archive", "STA", "Static", "preorder", [
      ["40", 0],
      ["41", 0],
      ["42", 0],
      ["43", 0],
      ["44", 0],
      ["45", 0],
    ]),
  },
  {
    id: "highland",
    slug: "highland-low",
    name: "Highland Low",
    subtitle: "White · Hand-finished",
    description:
      "A clean white low-top with a hand-finished upper and a soft, broken-in feel. Made to be worn hard and kept clean-ish.",
    story:
      "The Highland is a canvas for the everyday: a white leather base, a slightly higher foxing tape and an easy, familiar shape.",
    category: "casual",
    audience: "men",
    availability: "ready",
    basePriceKobo: nairaToKobo(135_000),
    images: [
      {
        src: IMG.highland,
        alt: "Highland Low white sneaker against a warm brick wall",
        position: "center",
      },
      {
        src: IMG.highland,
        alt: "Detail of the Highland Low side panel",
        position: "58% 48%",
      },
    ],
    materials: ["Leather upper", "Vulcanised rubber sole", "Cotton laces"],
    care: "Wipe clean with a damp cloth. Avoid machine washing.",
    featured: false,
    isNew: false,
    bestSeller: true,
    createdAt: "2026-10-12T12:00:00.000Z",
    seo: {
      title: "Highland Low — White",
      description:
        "A hand-finished white leather low-top sneaker, curated by Savvy Style Nigeria.",
    },
    variants: makeVariants("highland", "WHT", "White", "ready", [
      ["40", 3],
      ["41", 1],
      ["42", 0],
      ["43", 2],
      ["44", 2],
      ["45", 1],
    ]),
  },
  {
    id: "sienna",
    slug: "sienna-loafer",
    name: "Sienna Loafer",
    subtitle: "Cognac · Suede",
    description:
      "A soft suede loafer in warm cognac with a flexible sole and a hand-stitched apron. Relaxed tailoring, without the formality.",
    story:
      "A loafer should feel like an afterthought and look like a decision. The Sienna sits low, breaks in quickly and holds its shape.",
    category: "formal",
    audience: "men",
    availability: "ready",
    basePriceKobo: nairaToKobo(150_000),
    images: [
      {
        src: IMG.sienna,
        alt: "Sienna suede loafers in cognac, blue and grey on stone steps",
        position: "center",
      },
      {
        src: IMG.sienna,
        alt: "Detail of the Sienna loafer apron and hardware",
        position: "55% 60%",
      },
    ],
    materials: ["Suede upper", "Leather lining", "Rubber-injected sole"],
    care: "Brush with a suede brush. Protect before first wear.",
    featured: false,
    isNew: false,
    bestSeller: false,
    createdAt: "2026-10-02T15:20:00.000Z",
    seo: {
      title: "Sienna Loafer — Cognac Suede",
      description:
        "A soft cognac suede loafer with a hand-stitched apron, selected by Savvy Style Nigeria.",
    },
    variants: makeVariants("sienna", "COG", "Cognac", "ready", [
      ["40", 1],
      ["41", 2],
      ["42", 0],
      ["43", 1],
      ["44", 1],
      ["45", 0],
    ]),
  },
  {
    id: "oxford",
    slug: "oxford-house",
    name: "Oxford House",
    subtitle: "Chestnut · Goodyear welt",
    description:
      "A Goodyear-welted derby in chestnut leather with a closed lacing system and a measured, rounded toe. Designed to be repaired, not replaced.",
    story:
      "The Oxford House is the formal anchor of the collection: traditional construction, a warm finish and enough weight to feel substantial.",
    category: "formal",
    audience: "men",
    availability: "ready",
    basePriceKobo: nairaToKobo(195_000),
    images: [
      {
        src: IMG.oxford,
        alt: "Oxford House chestnut leather shoes on a wooden table",
        position: "center",
      },
      {
        src: IMG.oxford,
        alt: "Detail of the Oxford House leather upper and laces",
        position: "50% 55%",
      },
    ],
    materials: ["Full-grain leather", "Goodyear welt", "Leather sole"],
    care: "Polish monthly. Rest with shoe trees between wears.",
    featured: false,
    isNew: false,
    bestSeller: false,
    createdAt: "2026-09-22T09:10:00.000Z",
    seo: {
      title: "Oxford House — Chestnut Leather",
      description:
        "A Goodyear-welted chestnut leather derby, selected by Savvy Style Nigeria.",
    },
    variants: makeVariants("oxford", "CHS", "Chestnut", "ready", [
      ["40", 2],
      ["41", 0],
      ["42", 1],
      ["43", 2],
      ["44", 1],
      ["45", 1],
      ["46", 0],
    ]),
  },
  {
    id: "canvas",
    slug: "canvas-70",
    name: "Canvas 70",
    subtitle: "Vintage red · High top",
    description:
      "A high-top canvas shoe in a faded vintage red, with a vulcanised sole and a softened, archive-inspired finish.",
    story:
      "For days when the outfit is simple and the shoes are not. The Canvas 70 brings a single, confident note of colour.",
    category: "casual",
    audience: "unisex",
    availability: "ready",
    basePriceKobo: nairaToKobo(95_000),
    images: [
      {
        src: IMG.canvas,
        alt: "Canvas 70 high-top sneakers in vintage red and white",
        position: "center",
      },
      {
        src: IMG.canvas,
        alt: "Close detail of the Canvas 70 vulcanised sole",
        position: "55% 68%",
      },
    ],
    materials: ["Cotton canvas", "Vulcanised rubber", "Metal eyelets"],
    care: "Cold hand wash. Air dry only.",
    featured: false,
    isNew: true,
    bestSeller: false,
    createdAt: "2026-11-20T13:00:00.000Z",
    seo: {
      title: "Canvas 70 — Vintage Red",
      description:
        "A vintage red high-top canvas sneaker with a vulcanised sole, curated by Savvy Style Nigeria.",
    },
    variants: makeVariants("canvas", "VRD", "Vintage red", "ready", [
      ["36", 2],
      ["37", 2],
      ["38", 1],
      ["39", 0],
      ["40", 2],
      ["41", 1],
      ["42", 1],
      ["43", 0],
      ["44", 1],
    ]),
  },
  {
    id: "urban",
    slug: "urban-high",
    name: "Urban High",
    subtitle: "Black · Everyday",
    description:
      "A black high-top with a clean cupsole and a subtle tonal finish. The everyday shoe that works a little harder than it looks.",
    story:
      "A black high-top is a decision about restraint. This one keeps the line sharp and lets the wear do the talking.",
    category: "lifestyle",
    audience: "unisex",
    availability: "ready",
    basePriceKobo: nairaToKobo(165_000),
    images: [
      {
        src: IMG.urban,
        alt: "Urban High black high-top sneakers worn against a city wall",
        position: "center",
      },
      {
        src: IMG.urban,
        alt: "Detail of the Urban High canvas upper",
        position: "48% 45%",
      },
    ],
    materials: ["Canvas and leather upper", "Cupsole", "Cotton laces"],
    care: "Spot clean. Keep away from prolonged moisture.",
    featured: true,
    isNew: false,
    bestSeller: true,
    createdAt: "2026-11-05T16:20:00.000Z",
    seo: {
      title: "Urban High — Black",
      description:
        "A black high-top sneaker with a clean cupsole, selected by Savvy Style Nigeria.",
    },
    variants: makeVariants("urban", "BLK", "Black", "ready", [
      ["39", 1],
      ["40", 2],
      ["41", 3],
      ["42", 1],
      ["43", 0],
      ["44", 2],
      ["45", 1],
    ]),
  },
];

export const CATEGORIES: Category[] = [
  {
    slug: "lifestyle",
    name: "Lifestyle",
    description:
      "Court shapes and everyday silhouettes with a quieter point of view.",
    image: {
      src: IMG.urban,
      alt: "Urban High black high-top sneaker",
      position: "center",
    },
  },
  {
    slug: "performance",
    name: "Performance",
    description:
      "Technical runners selected for form as much as function.",
    image: {
      src: IMG.aeon,
      alt: "Aeon Runner performance shoe in bone and ember",
      position: "center",
    },
  },
  {
    slug: "casual",
    name: "Casual",
    description:
      "Easy shapes, softened finishes and colour used with intention.",
    image: {
      src: IMG.canvas,
      alt: "Canvas 70 high-top sneaker in vintage red",
      position: "center",
    },
  },
  {
    slug: "formal",
    name: "Formal",
    description:
      "Loafers and derbies built with traditional construction and modern restraint.",
    image: {
      src: IMG.oxford,
      alt: "Oxford House chestnut leather shoe",
      position: "center",
    },
  },
];

export const EDITORIAL_IMAGES = {
  campaign: {
    src: IMG.campaign,
    alt: "Editorial footwear image in warm street light",
  },
  canvas: {
    src: IMG.editorial,
    alt: "High-top sneakers against a warm yellow wall",
  },
} as const;

export function categoryName(slug: CategorySlug): string {
  return CATEGORIES.find((category) => category.slug === slug)?.name ?? slug;
}
