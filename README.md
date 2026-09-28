# Shopora: a marketplace storefront (Amazon-style clone)

A working e-commerce storefront modeled on Amazon's shopping flow, rebuilt to be cleaner on
phones. Built for the 8x assignment. The prompt-and-response record of how it was built is in
[`.agent-logs/`](.agent-logs), and the capture setup is described in [`CAPTURE-TEST.md`](CAPTURE-TEST.md).

> Original name and wordmark on purpose. Copying a real retailer's logo and a lookalike
> sign-in page into a public repo is how phishing kits look. The layout, flows and
> conventions are Amazon's; the brand is not.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# or: npm run build && npm start
```

Node 20+. No database or env setup needed: users and orders are written to `data/db.json`
(gitignored) on first sign-up. Set `AUTH_SECRET` in production.

## What works (the full buying loop)

| Area | What you can do |
|---|---|
| **Home** | Hero carousel (swipe, dots, pauses on hover, honours reduced-motion), category quad cards, round "Shop by category" row, deal / best-seller / category shelves |
| **Search** | Live type-ahead suggestions (keyboard navigable), department scope, relevance ranking, filters (department, rating, brand, price bands + custom range, deals), sort, pagination, removable filter chips, helpful empty state |
| **Product page** | Image gallery with hover zoom, price with list price & % off, stock urgency from real stock, buy box with quantity, **Add to cart** and **Buy Now**, rating breakdown, reviews, related products |
| **Cart** | Quantity stepper (capped by stock), delete, **save for later / move to cart**, free-delivery progress bar, persists across reloads and syncs between tabs |
| **Auth** | Sign up (inline validation), two-step sign in (email → password, like the real thing), show password, keep me signed in, sign out, `?next=` redirect back to where you were |
| **Checkout** | Requires sign-in, address form with per-field errors, remembered address, payment choice (simulated), order summary with shipping + tax |
| **Orders** | Confirmation screen, order history, order details with shipment progress, **Buy it again** |

### Better than a straight copy

- **Mobile first.** App-style bottom tab bar (Home, Shop, Deals, Orders, Cart with badge),
  a filter **bottom sheet** instead of a hidden sidebar, and a **sticky Add to cart / Buy Now bar**
  on product pages. Checked at 375px, 768px and desktop with no horizontal overflow.
- **Add-to-cart confirmation** toast with subtotal and one-tap Checkout, instead of a page jump.
- **Focused checkout.** Sign-in, sign-up and checkout drop the store header so there's nothing to wander off to.
- **No dark patterns.** No fake countdown timers and no inflated review counts: ratings counts
  are the real number of reviews in the data, and stock warnings use real stock.
- Accessible basics: skip link, labelled controls, `aria-live` cart updates, visible focus rings, Esc closes menus.

## Product judgement: what I left out, and why

Built first: the loop that makes a store a store (**find → decide → buy → see the order**), with real
server-side auth and server-side re-pricing at checkout (client prices are never trusted).

Left out on purpose:
- **Real payments.** Payment is simulated; no card fields are collected at all.
- **Seller side, Prime, video, music, Alexa, ads.** Separate products, not the shopping loop.
- **Writing reviews, wishlists with sharing, returns flow.** Nice, but secondary to buying.
- **Real database.** A JSON file is enough for a single-process demo and keeps setup at `npm install`.
  `src/lib/db.ts` is the only file to swap for Postgres/SQLite.

## Stack

Next.js 16 (App Router, Server Components, Server Actions) · React 19 · TypeScript · Tailwind CSS v4 ·
bcryptjs + jose (signed httpOnly session cookie). Catalog: 194 products with images and reviews from
[DummyJSON](https://dummyjson.com), vendored in `data/products.json` (`scripts/build-catalog.mjs` regenerates it).

```
src/app/(shop)/     storefront pages with the full header (home, /s, /dp/[id], /cart, /orders)
src/app/(focus)/    distraction-free pages (/signin, /register, /checkout)
src/app/actions/    server actions: auth, placeOrder
src/lib/            catalog search, JSON store, session, formatting
src/components/     layout, product, cart, checkout, search, auth UI
```
