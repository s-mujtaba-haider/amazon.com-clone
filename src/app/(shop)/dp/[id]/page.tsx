import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/product/Gallery';
import { BuyBox } from '@/components/product/BuyBox';
import { Price } from '@/components/product/Price';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductRail } from '@/components/product/ProductRail';
import { HeartButton } from '@/components/wishlist/HeartButton';
import { Stars } from '@/components/product/Stars';
import { deliveryDate } from '@/lib/format';
import { categoryLabel, getProduct, related } from '@/lib/products';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct(Number((await params).id));
  return { title: p ? p.title : 'Product not found', description: p?.description };
}

export default async function ProductPage({ params }: { params: Params }) {
  const p = getProduct(Number((await params).id));
  if (!p) notFound();

  const counts = [5, 4, 3, 2, 1].map(star => ({ star, n: p.reviews.filter(r => r.rating === star).length }));
  const bullets = [
    p.description,
    p.brand && `Brand: ${p.brand}`,
    p.warranty,
    p.shipping,
    p.returnPolicy,
  ].filter(Boolean) as string[];

  return (
    <div className="gutter pb-12">
      <nav aria-label="Breadcrumb" className="py-4 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>{' › '}
        <Link href={`/s?category=${p.category}`} className="hover:text-brand">
          {categoryLabel(p.category)}
        </Link>
        {p.brand && (
          <>
            {' › '}
            <Link href={`/s?category=${p.category}&brand=${encodeURIComponent(p.brand)}`} className="hover:text-brand">
              {p.brand}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_320px] xl:gap-8">
        <Gallery images={p.images} title={p.title} />

        <div className="min-w-0">
          {p.brand && <p className="mb-1 text-xs font-bold tracking-wider text-brand uppercase">{p.brand}</p>}
          <div className="flex items-start gap-3">
            <h1 className="flex-1 text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">{p.title}</h1>
            <HeartButton size="lg" className="shrink-0 ring-1 ring-line" item={{ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand, discountPercentage: p.discountPercentage, rating: p.rating }} />
          </div>
          {p.brand && (
            <Link href={`/s?brand=${encodeURIComponent(p.brand)}`} className="link text-sm">
              Visit the {p.brand} Store
            </Link>
          )}
          <a href="#reviews" className="mt-1 flex items-center gap-2 text-sm">
            <span>{p.rating.toFixed(1)}</span>
            <Stars rating={p.rating} />
            <span className="link">
              {p.reviews.length} rating{p.reviews.length === 1 ? '' : 's'}
            </span>
          </a>
          {p.discountPercentage >= 15 && (
            <span className="mt-2 inline-block rounded-sm bg-deal px-2 py-1 text-xs font-bold text-white">Limited time deal</span>
          )}
          <hr className="my-3 border-line" />
          <Price price={p.price} discount={p.discountPercentage} size="lg" />
          <p className="mt-2 text-sm">
            FREE Returns · <span className="text-muted">All prices include VAT where applicable.</span>
          </p>

          <table className="mt-5 w-full overflow-hidden rounded-2xl bg-white text-sm shadow-[var(--shadow-soft)]">
            <tbody>
              {[
                ['Brand', p.brand],
                ['Category', categoryLabel(p.category)],
                ['Warranty', p.warranty],
                ['Tags', p.tags.join(', ')],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <tr key={k}>
                    <th className="w-32 border-b border-line bg-[#fafbfe] px-4 py-2.5 text-left align-top font-semibold text-muted">{k}</th>
                    <td className="border-b border-line px-4 py-2.5 capitalize">{v}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2 className="mt-6 text-lg font-extrabold">About this item</h2>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-[#334155]">
            {bullets.map(b => (
              <li key={b} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <BuyBox
          product={{ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand }}
          delivery={deliveryDate(2)}
          fastest={deliveryDate(1)}
          availability={p.availability}
          returnPolicy={p.returnPolicy}
        />
      </div>

      <section className="mt-12">
        <h2 className="section-title mb-4">You may also like</h2>
        <ProductRail>
          {related(p, 16).map((r, i) => (
            <ProductCard key={r.id} p={r} deliveryLabel={deliveryDate(2)} index={i} />
          ))}
        </ProductRail>
      </section>


      <section id="reviews" className="mt-12 grid scroll-mt-36 gap-6 md:grid-cols-[320px_1fr] xl:gap-10">
        <div className="h-fit rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)] md:sticky md:top-36">
          <h2 className="text-xl font-extrabold">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={p.rating} size={20} />
            <span className="text-lg">{p.rating.toFixed(1)} out of 5</span>
          </div>
          <p className="mt-1 text-sm text-muted">{p.reviews.length} global ratings</p>
          <ul className="mt-4 space-y-3 text-sm">
            {counts.map(({ star, n }) => {
              const pct = p.reviews.length ? Math.round((n / p.reviews.length) * 100) : 0;
              return (
                <li key={star} className="flex items-center gap-3">
                  <span className="w-12 text-link">{star} star</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eef0f6]">
                    <span className="block h-full rounded-full bg-gradient-to-r from-star to-coral" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-10 text-right text-link">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-extrabold">Top reviews</h3>
          <ul className="grid gap-3 xl:grid-cols-2">
            {p.reviews.map((r, i) => (
              <li key={i} className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-2.5 text-sm font-semibold">
                  <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-coral-50 font-bold text-brand-700">
                    {r.name[0]}
                  </span>
                  {r.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Stars rating={r.rating} size={14} />
                  <b className="text-sm">{r.comment}</b>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Reviewed on {new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-mint-50 px-2 py-0.5 text-[11px] font-bold text-success">✓ Verified purchase</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
