import Link from 'next/link';
import { HeroCarousel, type Slide } from '@/components/home/HeroCarousel';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { bestSellers, byCategory, categoryLabel, getProducts, topDeals } from '@/lib/products';
import { currentUser } from '@/lib/session';

const thumbs = (ids: number[]) => getProducts(ids).map(p => p.thumbnail);

const SLIDES: Slide[] = [
  { title: 'Up to 30% off laptops & tablets', subtitle: 'Power for work and play, delivered fast.', cta: 'Shop tech deals', href: '/s?category=laptops', bg: 'linear-gradient(120deg,#0f3d6e,#1f6fb2 55%,#5fb3e8)', images: thumbs([78, 80, 82]) },
  { title: 'Fresh groceries, delivered', subtitle: 'Pantry staples and fresh picks, right to your door.', cta: 'Shop Grocery', href: '/s?category=groceries', bg: 'linear-gradient(120deg,#1d5e34,#3a9a4f 55%,#9bd26f)', images: thumbs([16, 21, 25]) },
  { title: 'Refresh your space', subtitle: 'Furniture and décor that feel like home.', cta: 'Shop Home', href: '/s?category=furniture', bg: 'linear-gradient(120deg,#6b3b20,#b06a3b 55%,#e7b47f)', images: thumbs([11, 12, 13]) },
  { title: 'Beauty best sellers', subtitle: 'Top-rated makeup, fragrance and skin care.', cta: 'Shop Beauty', href: '/s?category=beauty', bg: 'linear-gradient(120deg,#7a1f4d,#c2417f 55%,#f3a0c4)', images: thumbs([1, 118, 8]) },
];

const QUADS = [
  { title: 'Upgrade your phone', cats: ['smartphones'], href: '/s?category=smartphones' },
  { title: 'Shop fashion for less', cats: ['womens-dresses', 'mens-shirts', 'womens-shoes', 'mens-shoes'], href: '/s?category=womens-dresses' },
  { title: 'Kitchen favorites', cats: ['kitchen-accessories'], href: '/s?category=kitchen-accessories' },
  { title: 'Watches & jewelry', cats: ['womens-watches', 'mens-watches', 'womens-jewellery', 'sunglasses'], href: '/s?category=womens-watches' },
  { title: 'Get fit at home', cats: ['sports-accessories'], href: '/s?category=sports-accessories' },
  { title: 'Skin care essentials', cats: ['skin-care', 'fragrances'], href: '/s?category=skin-care' },
  { title: 'Bags for every day', cats: ['womens-bags'], href: '/s?category=womens-bags' },
  { title: 'Mobile accessories', cats: ['mobile-accessories'], href: '/s?category=mobile-accessories' },
];

function quadItems(cats: string[]) {
  if (cats.length === 1) return byCategory(cats[0], 4);
  return cats.map(c => byCategory(c, 1)[0]).filter(Boolean);
}

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="bg-page pb-8">
      <div className="mx-auto max-w-[1500px]">
        <HeroCarousel slides={SLIDES} />

        <div className="relative z-10 -mt-24 grid gap-5 px-3 sm:-mt-40 sm:grid-cols-2 sm:px-5 lg:-mt-52 lg:grid-cols-4">
          {!user && (
            <section className="card flex flex-col">
              <h2 className="text-xl font-bold">Sign in for the best experience</h2>
              <p className="mt-2 text-sm text-muted">Track orders, save items for later, and check out in seconds.</p>
              <Link href="/signin" className="btn-cta mt-4 w-full py-2">
                Sign in securely
              </Link>
              <p className="mt-2 text-sm">
                New here?{' '}
                <Link href="/register" className="link">
                  Create an account
                </Link>
              </p>
              <div className="mt-auto rounded bg-[#f7fafa] p-3 text-sm">
                <b>Free delivery</b> on orders over $35. Easy 30-day returns.
              </div>
            </section>
          )}
          {QUADS.slice(0, user ? 8 : 7).map(q => {
            const items = quadItems(q.cats);
            return (
              <section key={q.title} className="card flex flex-col">
                <h2 className="mb-3 text-xl font-bold">{q.title}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {items.map(p => (
                    <Link key={p.id} href={`/dp/${p.id}`} className="group">
                      <div className="flex aspect-square items-center justify-center bg-[#f7f7f7] p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumbnail} alt="" loading="lazy" className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                      </div>
                      <span className="mt-1 line-clamp-1 text-xs">{q.cats.length > 1 ? categoryLabel(p.category) : p.title}</span>
                    </Link>
                  ))}
                </div>
                <Link href={q.href} className="link mt-auto pt-3 text-sm">
                  Shop now
                </Link>
              </section>
            );
          })}
        </div>

        <div className="mt-5 space-y-5 px-3 sm:px-5">
          <ProductCarousel title="Today's Deals" items={topDeals(16)} href="/s?deals=1&sort=discount" showPrice />
          <ProductCarousel title="Best Sellers across the store" items={bestSellers(16)} href="/s?sort=rating" />
          <ProductCarousel title="Top picks in Laptops & Tablets" items={[...byCategory('laptops'), ...byCategory('tablets')]} href="/s?category=laptops" />
          <ProductCarousel title="Groceries you'll love" items={byCategory('groceries', 16)} href="/s?category=groceries" showPrice />
          <ProductCarousel title="Furniture & home décor" items={[...byCategory('furniture'), ...byCategory('home-decoration')]} href="/s?category=furniture" />
        </div>
      </div>
    </div>
  );
}
