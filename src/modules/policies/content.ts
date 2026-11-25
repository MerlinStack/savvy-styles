export type PolicySlug =
  | "delivery"
  | "pre-orders"
  | "privacy"
  | "terms";

export interface PolicySection {
  heading: string;
  paragraphs: string[];
}

export interface Policy {
  slug: PolicySlug;
  title: string;
  summary: string;
  sections: PolicySection[];
}

const DRAFT_NOTE =
  "This is a draft prepared for the preview build. Final wording is being confirmed with the business owner. Nothing on this page is a published policy or a promise.";

export const POLICIES: Record<PolicySlug, Policy> = {
  delivery: {
    slug: "delivery",
    title: "Delivery & returns",
    summary:
      "How delivery and returns will work. The final terms are still being confirmed.",
    sections: [
      {
        heading: "Status",
        paragraphs: [
          DRAFT_NOTE,
          "Courier partners, rates and return windows have not been approved yet. The preview uses clearly labelled sample shipping rates so the checkout calculation can be reviewed.",
        ],
      },
      {
        heading: "What this policy will cover",
        paragraphs: [
          "The final policy will set out the delivery zones — Lagos, the rest of Nigeria and international — together with rates, expected timelines, tracking, failed-delivery handling and who bears return shipping.",
          "It will also set out the condition required for a return, the window in which a return can be requested, and how refunds are issued.",
        ],
      },
      {
        heading: "Today",
        paragraphs: [
          "Shipping is calculated at checkout from the destination. Sample rates are marked as samples. No delivery timeline should be relied on until the final policy is published.",
          "Nothing in this preview should be read as a commitment to deliver within a stated number of days.",
        ],
      },
    ],
  },
  "pre-orders": {
    slug: "pre-orders",
    title: "Pre-order policy",
    summary:
      "How fully paid pre-orders are reserved and allocated. The final terms are still being confirmed.",
    sections: [
      {
        heading: "Status",
        paragraphs: [
          DRAFT_NOTE,
          "The storefront applies fully paid pre-orders and allocates them in the order payments are received. The cancellation and refund terms that will surround that flow still need owner approval.",
        ],
      },
      {
        heading: "What is modelled today",
        paragraphs: [
          "A pre-order is a piece reserved before the shipment lands. It is paid in full at checkout, not held with a deposit.",
          "The window shown on each product is a sample value in this preview. It is not a confirmed arrival date.",
        ],
      },
      {
        heading: "What the final policy will set",
        paragraphs: [
          "The final policy will cover cancellation windows, what happens if a shipment is delayed or a size cannot be allocated, how refunds are processed, and how updates are communicated while a pre-order is open.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy",
    summary:
      "What the preview stores, and what the production privacy policy will need to cover.",
    sections: [
      {
        heading: "Status",
        paragraphs: [
          DRAFT_NOTE,
          "A production privacy policy requires the final list of processors, retention periods and the business's registered details. Those have not been supplied.",
        ],
      },
      {
        heading: "What this preview stores",
        paragraphs: [
          "The newsletter form writes an email address to a local development file. The contact form writes the submitted name, email and message to a local development file. Neither is sent to a third party.",
          "The bag, wishlist and display-currency preference are stored in this browser's local storage. They are not sent to a server.",
          "No analytics or advertising tracker is installed in this build.",
        ],
      },
      {
        heading: "What the production policy will cover",
        paragraphs: [
          "Customer account details, order and delivery information, payment references (never card numbers), the processors used for payments, media and email, retention periods, and the customer's rights over their data.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Questions about data can be sent through the contact page. Direct contact details will be published once confirmed by the owner.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of use",
    summary:
      "The terms that will govern purchases. The final text is still being prepared.",
    sections: [
      {
        heading: "Status",
        paragraphs: [
          DRAFT_NOTE,
          "No contract is formed by using this preview. Payment is disabled and no order is created.",
        ],
      },
      {
        heading: "What is true in this build",
        paragraphs: [
          "Product names, prices, stock levels and imagery are development fixtures. They are not an offer for sale and do not represent current inventory.",
          "Display currencies other than the Naira use indicative development rates and are not financial data.",
        ],
      },
      {
        heading: "What the final terms will cover",
        paragraphs: [
          "Order acceptance, pricing and availability, payment, pre-orders, delivery, returns, intellectual property, limitation of liability and the governing law of the business.",
        ],
      },
    ],
  },
};

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES[slug as PolicySlug];
}
