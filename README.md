# Kyro: a marketplace storefront (Amazon-style clone)

A working e-commerce storefront modeled on Amazon's shopping flow, with its own modern design:
full-width layouts that fill any screen, and an app-like experience on phones. Built for the 8x assignment. The prompt-and-response record of how it was built is in
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

Node 20+. No database or env setup needed locally: users and orders are written to
`data/db.json` (gitignored) on first sign-up.

## Deploy on Vercel

Vercel's filesystem is read-only, so deployed accounts and orders live in **Upstash Redis**
(free tier, added from inside Vercel; no separate account needed):

1. Vercel project → **Storage** → **Create** → **Upstash for Redis** (Marketplace) → free plan →
   connect it to this project. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. Project → **Settings → Environment Variables** → add `AUTH_SECRET` = a long random string
   (e.g. output of `openssl rand -base64 32`). It signs the login cookie.
3. **Redeploy** (env vars only apply to new deployments).

`src/lib/db.ts` uses Redis whenever those variables are present and the JSON file otherwise.
On Vercel without Redis, sign-in / sign-up / checkout show a clear "storage is not set up"
message instead of failing silently.

## What works (the full buying loop)

| Area | What you can do |
|---|---|
| **Home** | Hero carousel (swipe, dots, pauses on hover, honours reduced-motion), category quad cards, round "Shop by category" row, deal / best-seller / category shelves |
| **Search** | Live type-ahead suggestions (keyboard navigable), department scope, relevance ranking, filters (department, rating, brand, price bands + custom range, deals), sort, pagination, removable filter chips, helpful empty state |
| **Product page** | Image gallery with hover zoom, price with list price & % off, stock urgency from real stock, buy box with quantity, **Add to cart** and **Buy Now**, rating breakdown, reviews, related products |
| **Wishlist** | Save/unsave from any card or product page, wishlist page, add all to cart, header + tab-bar badges |
| **Cart** | Quantity stepper (capped by stock), delete, **save for later / move to cart**, free-delivery progress bar, persists across reloads and syncs between tabs |
| **Auth** | Sign up (inline validation), two-step sign in (email → password, like the real thing), show password, keep me signed in, sign out, `?next=` redirect back to where you were |
| **Checkout** | Requires sign-in, address form with per-field errors, remembered address, payment choice (simulated), order summary with shipping + tax |
| **Orders** | Confirmation screen, order history, order details with shipment progress, **Buy it again** |

### Better than a straight copy

- **Own visual identity.** Ink + violet theme with coral deals, Plus Jakarta Sans, soft cards and
  gradient promos; design tokens live in `src/app/globals.css`, so the whole store re-themes from one file.
- **Uses the whole screen.** No fixed-width container: product grids auto-fill columns, so a
  1920px or 2560px monitor shows more products instead of empty side margins.
- **Richer product cards.** Hover lift, one-tap quick add on the image, wishlist heart, rating pill,
  discount and low-stock badges, delivery estimate.
- **Wishlist.** Heart any product; `/wishlist` with add-to-cart and "add all".
- **Bento home page.** Hero carousel + promo tiles, perks strip, category tiles, deal rail,
  spotlight banners, best-seller grid, category rails.
- **Split-screen sign in / sign up** with a brand panel on desktop.

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
