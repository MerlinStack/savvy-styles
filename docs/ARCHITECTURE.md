# Savvy Style — Architecture

## 1. Status and intent

This repository is a production-oriented foundation for the Savvy Style Nigeria
storefront and business platform. It is not a template. The architecture is a
**modular monolith**: one deployable Next.js application, with business rules
kept in framework-independent modules under `src/modules`.

The first iteration implements the premium storefront foundation (catalogue,
product detail, cart, wishlist, currency display) against clearly labelled
development fixtures. Backend and payment work is staged behind the interfaces
described below and is not represented as live functionality.

As of this milestone the storefront is complete and verified: the storefront
routes build cleanly, the domain unit suite passes, and Playwright covers the
primary browse → product → bag → checkout-shell journeys. The commerce schema
exists in `prisma/schema.prisma`, but no migration has been applied because no
PostgreSQL instance is available in this environment (see §9). Client-side cart
and wishlist state is real; orders, accounts, payments and stock are not yet
persisted.

## 2. Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS 4 with CSS design tokens |
| Server state | PostgreSQL + Prisma 7 (planned; see blockers) |
| Client state | Zustand with `persist` for cart and wishlist |
| Animation | GSAP + ScrollTrigger, Framer Motion |
| Media | Local fixtures now, Cloudinary interface for production |
| Payments | Paystack adapter behind a provider-independent interface |
| Tests | Vitest (domain) and Playwright (E2E) |

## 3. Repository layout

```
src/
  app/
    (store)/            public storefront route group
      shop/             catalogue with URL-driven filters
      product/[slug]/   product detail
      collections/      editorial collection index
      new-arrivals/     preset catalogue view
      ready-stock/      preset catalogue view
      pre-orders/       preset catalogue view
      cart/             full cart page
      checkout/         checkout shell (payment gated by configuration)
      wishlist/
      about/ contact/ policies/
    api/
      geo/              country header → display currency
      newsletter/       validated subscription capture
      checkout/         payment-initiation boundary (configuration gated)
    layout.tsx          fonts, metadata, global providers
  components/
    ui/                 primitives (button, container, price, reveal…)
    layout/             header, footer, drawers, search
    storefront/         homepage sections
    product/            gallery and purchase panel
    catalogue/          filterable catalogue UI
    cart/ checkout/     line items and summaries
  modules/
    money/              integer-kobo arithmetic and formatting
    currency/           currency catalogue, rates, conversion
    catalogue/          product types, fixtures, query functions
    cart/               cart store and total calculations
    wishlist/           persisted wishlist store
    shipping/           zone resolution and sample-rate engine
    inventory/          availability rules and pre-order lifecycle
    payments/           provider interface and state machine (planned)
  lib/                  shared utilities
tests/
  unit/                 pure domain tests
  e2e/                  browser journeys
prisma/                 schema.prisma (commerce contract); migrations and seed
                        will be added when a database is provisioned
```

## 4. Business boundaries

### Products and variants

A `Product` owns merchandising data (name, slug, copy, category, imagery, SEO).
A `ProductVariant` owns the purchasable unit (size, colour, SKU, stock). Prices
are stored as **integer kobo** in NGN. No monetary value is ever stored as a
float.

The house catalogue model has two independent concepts that must not be
collapsed:

- **availability mode** — `READY_STOCK` or `PRE_ORDER`;
- **stock** — on-hand units for ready stock, or zero/expected units for
  pre-orders.

Pre-order demand is never counted as available inventory.

### Inventory

The production design uses a reservation ledger:

1. Checkout creates a `StockReservation` for each ready-stock variant with an
   expiry window.
2. The reservation is created in the same database transaction as the order,
   using a conditional update so concurrent checkouts cannot oversell.
3. Verified payment converts reservations into a stock decrement and an
   `InventoryMovement` audit record.
4. Failed or expired payments release reservations.
5. Administrators can adjust stock only through an audited movement record.

The storefront validates locally, but the server is always authoritative.
The current fixture storefront enforces availability for demonstration only;
it is not a substitute for the transactional inventory service.

### Payments

`PaymentProvider` isolates gateway specifics. The Paystack adapter is expected
to:

- initialise a transaction server-side with a unique reference;
- verify a transaction by reference before trusting it;
- validate the `x-paystack-signature` HMAC on webhooks;
- persist immutable `PaymentEvent` records with a provider event identifier so
  duplicate deliveries are idempotent;
- transition payments through `PENDING → PROCESSING → SUCCESSFUL | FAILED |
  CANCELLED`, with refund states recorded separately.

A successful browser redirect is never proof of payment. Orders become paid only
from a verified server-to-server response or an authenticated webhook.

### Currency

NGN is the canonical pricing and accounting currency. Display currency is a
presentation concern:

- `basePriceKobo` remains NGN;
- conversion uses a cached rate snapshot, stored on the order at checkout;
- payment currency is limited to currencies the Paystack merchant account can
  actually settle. The initial safe default is **NGN settlement**;
- checkout discloses the actual charge currency before payment.

Rates shipped in `src/modules/currency/rates.ts` are development fallbacks and
must not be treated as financial data.

### Shipping

`src/modules/shipping` resolves a destination to a zone and a rate. Rates in the
fixture configuration are **sample rates** pending owner-supplied pricing.
Couriers are not invented: a provider interface is reserved for a verified
integration, and administrators can configure rates manually.

### Identity and permissions

The schema uses one `User` model with a role of `CUSTOMER`, `OWNER`, `MANAGER`
or `STAFF`, plus `Session` rows keyed by a hashed token. Every staff-facing
mutation will be authorised in a server command handler, not by hiding
navigation. The matrix below is a **provisional proposal for owner approval**,
not an agreed business policy:

| Capability | OWNER | MANAGER | STAFF |
| --- | --- | --- | --- |
| Catalogue, pricing, media | yes | yes | no |
| Stock adjustments | yes | yes | draft only |
| Order status and fulfilment | yes | yes | yes |
| Refunds | yes | yes | no |
| Staff roles and permissions | yes | no | no |
| Store settings and integrations | yes | no | no |
| Audit log access | yes | yes | own actions |

Customer accounts use a secure session strategy and support guest checkout;
guest order lookup uses a signed, short-lived token. The storefront does not
yet expose registration or login, and no placeholder auth UI is presented.

### Commerce schema

`prisma/schema.prisma` is the contract for Phase 2 and the admin dashboard:
users, sessions and addresses; categories, products, images and variants;
collections; carts; orders, order items and pre-orders; payments and refunds;
order events; discount codes; shipping rate configuration; wishlist,
newsletter and contact records; audit logs and store settings. Money is always
an integer in kobo, and order lines snapshot name, SKU, size, colour and price
so later catalogue edits cannot rewrite a completed order's contents.

A reservation ledger (`StockReservation`, `InventoryMovement`) is described in
§4 but is **not yet modelled**; it must be added before live stock can be sold.

### Audit

Every sensitive mutation (stock adjustment, order status change, refund, role
change, content publish) writes an `AuditLog` row with actor, action, entity,
before/after payload and timestamp.

## 5. Request and data flows

### Catalogue

Storefront pages are server components. Fixture data is local and synchronous.
Production moves catalogue reads behind `modules/catalogue` with cached queries
and explicit invalidation after admin mutations. Filter state lives in the URL
(`category`, `size`, `availability`, `min`, `max`, `sort`, `q`) so views are
shareable and back/forward works.

### Cart

The cart is a client-side, persisted Zustand store keyed by `variantId`. It
stores product and variant identifiers plus quantity — not prices as a source
of truth. Prices and availability are re-derived from catalogue data at render.
Checkout re-validates every line server-side.

### Checkout

`app/api/checkout` is the current boundary. It validates the submitted payload,
resolves shipping and totals, then checks payment-provider configuration. Until
a database and Paystack credentials exist it returns a truthful
`PAYMENT_NOT_CONFIGURED` response; it does not fabricate an order or a payment.

## 6. Rendering and caching

`cacheComponents` is enabled by the Next.js 16 scaffold. Static marketing and
product pages are prerendered. Runtime APIs (`cookies`, `headers`,
`searchParams`) are isolated behind Suspense boundaries. No dynamic read is
introduced into the static shell.

Two consequences are worth recording:

- **Unknown dynamic params are soft 404s.** The prerendered shell is committed
  as `200` before `notFound()` runs, so `/product/<unknown>` and
  `/policies/<unknown>` render the branded not-found UI with `noindex` and a
  `next-error: not-found` meta tag rather than an HTTP 404. This is Next.js's
  documented Cache Components behaviour, not an application bug. A hard 404
  would require dropping Cache Components or intercepting the slug in proxy.
- **Dev origin matters.** Next only serves its HMR client to trusted hosts. If
  the site is opened on `127.0.0.1`, hydration is blocked unless that host is
  listed in `allowedDevOrigins` (`next.config.ts`). The Playwright and visual QA
  harnesses use `localhost` for this reason.

Entrance animations never hide content permanently: `[data-reveal]` content is
forced visible under `prefers-reduced-motion: reduce` and `scripting: none`, so
a no-JS or reduced-motion visitor still sees the full page even though the
server-rendered markup starts at `opacity: 0` for the client animation.

## 7. Security baseline

- server-side Zod validation at every trust boundary;
- secrets only in environment variables, never `NEXT_PUBLIC_*`;
- HMAC-verified webhooks, idempotency keys and replay protection;
- rate limiting on auth, checkout, newsletter and contact endpoints (target);
- secure, `httpOnly`, `sameSite` session cookies;
- role checks in handlers, not just UI;
- CSP and standard security headers (target deployment task);
- no card data ever touches the application;
- dependency and backup maintenance as an ongoing obligation.

## 8. Testing

- **Unit**: money arithmetic, conversion rounding, catalogue filters, cart
  totals, shipping zone resolution, inventory availability, pre-order state
  transitions and the checkout route contract — 118 tests in 8 files.
- **E2E**: Playwright on desktop Chromium and Pixel 7 (Chromium) covers the
  homepage, filtering, product selection, bag persistence, search, policy
  drafts, soft-404 UI and mobile navigation/overflow. A local
  `scripts/visual-qa.mjs` capture reports console errors, broken images,
  horizontal overflow and heading structure across every route.
- **Integration**: database-backed order creation, reservation races, webhook
  replay, RBAC — requires PostgreSQL.

`npm run test:e2e` expects a running app on `http://localhost:3000` (the
Playwright config starts one if absent). E2E against the dev server exercises
real hydration; run it against `next start` before release for production
parity.

## 9. Current blockers and external dependencies

| Dependency | Impact | Handling |
| --- | --- | --- |
| PostgreSQL instance / `DATABASE_URL` | No persistent orders, admin, auth | Schema and interfaces prepared; no fabricated persistence |
| Prisma engine download (`binaries.prisma.sh` unreachable) | `prisma generate`/`migrate` cannot run here | Schema committed; run `npm run db:generate` on a networked machine/CI |
| Paystack merchant account and keys | No live payment | Provider boundary returns explicit configuration error |
| Owner product photography, prices, stock, policies | Fixtures only | Labelled sample catalogue; real assets required before launch |
| Domain purchase | Deployment URLs | `NEXT_PUBLIC_SITE_URL` configurable |
| Email provider credentials | No transactional email | Newsletter uses local NDJSON capture in development |
| Cloudinary account | Media pipeline | Local optimised images now; interface documented |
| Courier rates | Shipping totals | Sample rate table, admin-configurable later |
| Provisional role matrix | Admin authorisation details | Confirm with owner before Phase 2 build |

There is intentionally no `db:seed` script yet: a seed that has never been run
against a real database would be presented as working when it is not. It will
be added with the first migration.

## 10. Deployment target

Vercel (or equivalent Node host) with managed PostgreSQL, object media, error
and uptime monitoring, automated backups, and separate preview/staging/
production environments. Domain ownership remains with the business owner.
