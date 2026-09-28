import Link from 'next/link';
import { HeroCarousel, type Slide } from '@/components/home/HeroCarousel';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductRail } from '@/components/product/ProductRail';
import { bestSellers, brands, byCategory, categoryLabel, getProduct, getProducts, topDeals } from '@/lib/products';
import { deliveryDate } from '@/lib/format';
import { currentUser } from '@/lib/session';

const thumbs = (ids: number[]) => getProducts(ids).map(p => p.thumbnail);

const SLIDES: Slide[] = [
  { eyebrow: 'Tech week', title: 'Laptops that keep up with you', subtitle: 'Up to 30% off top brands. Free delivery over $35.', cta: 'Shop laptops', href: '/s?category=laptops', bg: 'linear-gradient(125deg,#2a1b8f 0%,#5b3df5 55%,#9b7bff 100%)', images: thumbs([78, 80, 82]) },
  { eyebrow: 'Fresh daily', title: 'Groceries at your door', subtitle: 'Fresh produce and pantry staples, delivered in days.', cta: 'Shop grocery', href: '/s?category=groceries', bg: 'linear-gradient(125deg,#064e3b 0%,#0e9f6e 55%,#6ee7b7 100%)', images: thumbs([16, 21, 25]) },
  { eyebrow: 'Home refresh', title: 'Make your space yours', subtitle: 'Furniture and décor picked for comfort and style.', cta: 'Shop home', href: '/s?category=furniture', bg: 'linear-gradient(125deg,#7c2d12 0%,#ea580c 55%,#fdba74 100%)', images: thumbs([11, 12, 13]) },
  { eyebrow: 'Beauty edit', title: 'Glow up, for less', subtitle: 'Best-selling makeup, fragrance and skin care.', cta: 'Shop beauty', href: '/s?category=beauty', bg: 'linear-gradient(125deg,#831843 0%,#db2777 55%,#f9a8d4 100%)', images: thumbs([1, 118, 8]) },
];

const CATEGORY_TILES: { slug: string; tint: string }[] = [
  { slug: 'smartphones', tint: '#eef2ff' },
  { slug: 'laptops', tint: '#ecfeff' },
  { slug: 'tablets', tint: '#f0f9ff' },
  { slug: 'mobile-accessories', tint: '#f5f3ff' },
  { slug: 'groceries', tint: '#ecfdf5' },
  { slug: 'beauty', tint: '#fdf2f8' },
  { slug: 'skin-care', tint: '#fff7ed' },
  { slug: 'fragrances', tint: '#fef2f2' },
  { slug: 'furniture', tint: '#fefce8' },
  { slug: 'home-decoration', tint: '#f7fee7' },
  { slug: 'kitchen-accessories', tint: '#fff1f2' },
  { slug: 'womens-dresses', tint: '#fdf4ff' },
  { slug: 'mens-shirts', tint: '#eff6ff' },
  { slug: 'womens-shoes', tint: '#fff7ed' },
  { slug: 'mens-watches', tint: '#f8fafc' },
  { slug: 'sunglasses', tint: '#f0fdfa' },
  { slug: 'sports-accessories', tint: '#f0fdf4' },
  { slug: 'vehicle', tint: '#f1f5f9' },
];

const PERKS = [
  { title: 'Free delivery', text: 'On orders over $35', d: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
  { title: '30-day returns', text: 'Change your mind, no stress', d: 'M4 4v6h6M20 20v-6h-6M5 15a8 8 0 0 0 14 2M19 9A8 8 0 0 0 5 7' },
  { title: 'Secure checkout', text: 'Encrypted, private, safe', d: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4' },
  { title: 'Real reviews', text: 'Ratings from verified buyers', d: 'm12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z' },
];

const SPOTLIGHTS = [
  { title: 'Upgrade your phone', text: 'Flagships and budget heroes, all in one place.', href: '/s?category=smartphones', bg: 'linear-gradient(135deg,#0b1220,#1d2742)', ids: [124, 133, 129] },
  { title: 'Kitchen favorites', text: 'Tools and gadgets that make cooking fun.', href: '/s?category=kitchen-accessories', bg: 'linear-gradient(135deg,#7c2d12,#c2410c)', ids: [51, 66, 71] },
  { title: 'Accessorize', text: 'Watches, bags and sunglasses to finish the look.', href: '/s?category=womens-watches', bg: 'linear-gradient(135deg,#4c1d95,#7c3aed)', ids: [190, 172, 154] },
];

function SectionHead({ title, subtitle, href, cta = 'See all' }: { title: string; subtitle?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-0.5 hidden text-sm text-muted sm:block">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] transition hover:bg-ink hover:text-white">
          {cta}
          <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const user = await currentUser();
  const delivery = deliveryDate(2);
  const deals = topDeals(16);
  const best = bestSellers(24);
  const dealHero = deals[0];
  const newTech = getProduct(160)!;
  const BRANDS = brands(24);

  return (
    <div className="gutter space-y-8 py-4 sm:space-y-12 sm:py-6">
      {/* Hero bento */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <HeroCarousel slides={SLIDES} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2">
          <Link href="/s?deals=1&sort=discount" className="group relative flex overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1eb] to-[#ffe0d2] p-4 sm:p-6">
            <div className="relative z-10 max-w-[70%] sm:max-w-[60%]">
              <span className="rounded-full bg-deal px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white sm:text-[11px]">Up to {Math.round(dealHero.discountPercentage)}% off</span>
              <h3 className="mt-2 text-base leading-tight font-extrabold text-ink sm:text-2xl">Deals of the day</h3>
              <p className="mt-1 hidden text-sm text-[#7c2d12] sm:block">Fresh markdowns across every department.</p>
              <span className="mt-2 inline-block text-sm font-bold text-deal group-hover:underline sm:mt-3">Shop deals →</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dealHero.thumbnail} alt="" className="absolute -right-3 -bottom-3 h-24 w-24 object-contain mix-blend-multiply transition duration-500 group-hover:scale-110 sm:h-40 sm:w-40 lg:h-36 lg:w-36 xl:h-44 xl:w-44" />
          </Link>
          <Link href="/s?category=tablets" className="group relative flex overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-ink-3 p-4 text-white sm:p-6">
            <div className="relative z-10 max-w-[70%] sm:max-w-[60%]">
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap sm:text-[11px]">New in tech</span>
              <h3 className="mt-2 text-base leading-tight font-extrabold sm:text-2xl">Tablets for work &amp; play</h3>
              <p className="mt-1 hidden text-sm text-white/70 sm:block">From {`$${Math.min(...byCategory('tablets').map(p => p.price)).toFixed(0)}`}. Delivered {delivery.split(', ')[0]}.</p>
              <span className="mt-2 inline-block text-sm font-bold text-[#b9a8ff] group-hover:underline sm:mt-3">Explore →</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={newTech.thumbnail} alt="" className="absolute -right-2 -bottom-2 h-24 w-24 object-contain drop-shadow-2xl transition duration-500 group-hover:scale-110 sm:h-40 sm:w-40 lg:h-36 lg:w-36 xl:h-44 xl:w-44" />
          </Link>
        </div>
      </div>

      {/* Perks strip */}
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {PERKS.map((p, i) => (
          <li key={p.title} data-reveal data-perk style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:p-4">
            <span className="tile-pop flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 transition group-hover:bg-brand sm:h-12 sm:w-12">
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-brand stroke-2 transition group-hover:stroke-white sm:h-6 sm:w-6">
                <path d={p.d} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <b className="block text-[13px] sm:text-[15px]">{p.title}</b>
              <span className="block truncate text-[11px] text-muted sm:text-sm">{p.text}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Brand ticker */}
      <section aria-label="Popular brands" data-reveal className="relative overflow-hidden rounded-2xl bg-white py-4 shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {BRANDS.map(b => (
            <Link
              key={b}
              href={`/s?brand=${encodeURIComponent(b)}`}
              className="rounded-full bg-[#f5f6fa] px-5 py-2 text-sm font-bold whitespace-nowrap text-[#475569] transition hover:bg-brand hover:text-white"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section data-reveal>
        <SectionHead title="Shop by category" subtitle="Everything you need, one tap away" href="/s" cta="All products" />
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(128px,1fr))] sm:gap-4">
          {CATEGORY_TILES.map(({ slug, tint }, i) => {
            const p = byCategory(slug, 1)[0];
            return (
              <li key={slug} data-reveal style={{ '--reveal-delay': `${(i % 9) * 40}ms` } as React.CSSProperties}>
                <Link href={`/s?category=${slug}`} className="tile-pop group flex flex-col items-center gap-2 rounded-2xl bg-white p-2.5 text-center shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-3">
                  <span className="flex aspect-square w-full items-center justify-center rounded-xl" style={{ background: tint }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.thumbnail} alt="" loading="lazy" className="h-4/5 w-4/5 object-contain mix-blend-multiply transition duration-500 group-hover:scale-110" />
                  </span>
                  <span className="text-xs leading-tight font-semibold sm:text-sm">{categoryLabel(slug)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Deals rail */}
      <section data-reveal className="rounded-3xl bg-gradient-to-br from-[#fff5f0] via-white to-[#f4f1ff] p-3 ring-1 ring-black/[.03] sm:p-6">
        <SectionHead title="🔥 Today's biggest deals" subtitle="Sorted by discount, refreshed daily" href="/s?deals=1&sort=discount" />
        <ProductRail>
          {deals.map((p, i) => (
            <ProductCard key={p.id} p={p} deliveryLabel={delivery} priority={i < 4} index={i} />
          ))}
        </ProductRail>
      </section>

      {/* Spotlight banners */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {SPOTLIGHTS.map((s, i) => (
          <Link key={s.title} href={s.href} data-reveal style={{ background: s.bg, '--reveal-delay': `${i * 100}ms` } as React.CSSProperties} className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-3xl p-5 text-white transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:min-h-[220px] sm:p-6">
            <div className="relative z-10 max-w-[55%]">
              <h3 className="text-xl leading-tight font-extrabold sm:text-2xl">{s.title}</h3>
              <p className="mt-1.5 text-sm text-white/75">{s.text}</p>
            </div>
            <span className="relative z-10 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink transition group-hover:gap-2">
              Shop now <span aria-hidden>→</span>
            </span>
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-end">
              {getProducts(s.ids).map((p, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.thumbnail}
                  alt=""
                  loading="lazy"
                  className={`rounded-2xl bg-white/95 object-contain p-2 shadow-xl transition duration-500 group-hover:-translate-y-1 ${k === 0 ? 'relative z-10 h-24 w-24 sm:h-28 sm:w-28' : k === 1 ? '-ml-6 h-20 w-20 rotate-6 sm:h-24 sm:w-24' : 'hidden'}`}
                />
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Best sellers grid (fills any width) */}
      <section>
        <SectionHead title="Best sellers" subtitle="What shoppers love right now" href="/s?sort=rating" />
        <div className="product-grid">
          {best.map((p, i) => (
            <ProductCard key={p.id} p={p} deliveryLabel={delivery} index={i} />
          ))}
        </div>
      </section>

      {/* Guest CTA */}
      {!user && (
        <section data-reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-8 text-white sm:px-10 sm:py-12">
          <span aria-hidden className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <span aria-hidden className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-coral/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Sign in for a better Shopora</h2>
              <p className="mt-2 max-w-xl text-white/70">Track orders, keep a wishlist, reorder in one tap and check out in seconds.</p>
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
              <Link href="/signin" className="btn-cta flex-1 px-6 py-3 text-base sm:flex-none">
                Sign in
              </Link>
              <Link href="/register" className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold ring-1 ring-white/20 transition hover:bg-white/20 sm:flex-none">
                Create account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category rails */}
      {[
        { title: 'Top picks in electronics', href: '/s?category=smartphones', items: [...byCategory('smartphones', 8), ...byCategory('laptops', 5), ...byCategory('tablets', 3)] },
        { title: 'Fresh groceries', href: '/s?category=groceries', items: byCategory('groceries', 16) },
        { title: 'Style for everyone', href: '/s?category=womens-dresses', items: [...byCategory('womens-dresses', 4), ...byCategory('mens-shirts', 4), ...byCategory('womens-shoes', 4), ...byCategory('mens-shoes', 4)] },
      ].map(r => (
        <section key={r.title} data-reveal>
          <SectionHead title={r.title} href={r.href} />
          <ProductRail>
            {r.items.map((p, i) => (
              <ProductCard key={p.id} p={p} deliveryLabel={delivery} index={i} />
            ))}
          </ProductRail>
        </section>
      ))}
    </div>
  );
}
