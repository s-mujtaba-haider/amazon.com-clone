import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/product/Gallery';
import { BuyBox } from '@/components/product/BuyBox';
import { Price } from '@/components/product/Price';
import { ProductCarousel } from '@/components/product/ProductCarousel';
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
    <div className="mx-auto max-w-[1500px] px-4 pb-10">
      <nav aria-label="Breadcrumb" className="py-3 text-xs text-muted">
        <Link href={`/s?category=${p.category}`} className="hover:text-link-hover hover:underline">
          {categoryLabel(p.category)}
        </Link>
        {p.brand && (
          <>
            {' › '}
            <Link href={`/s?category=${p.category}&brand=${encodeURIComponent(p.brand)}`} className="hover:text-link-hover hover:underline">
              {p.brand}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_260px]">
        <Gallery images={p.images} title={p.title} />

        <div className="min-w-0">
          <h1 className="text-xl leading-snug font-medium sm:text-2xl">{p.title}</h1>
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

          <table className="mt-4 text-sm">
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
                    <th className="py-1 pr-6 text-left align-top font-bold">{k}</th>
                    <td className="py-1 capitalize">{v}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <hr className="my-3 border-line" />
          <h2 className="text-base font-bold">About this item</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {bullets.map(b => (
              <li key={b}>{b}</li>
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

      <hr className="my-8 border-line" />
      <ProductCarousel title="Products related to this item" items={related(p, 16)} showPrice />
      <hr className="my-8 border-line" />

      <section id="reviews" className="grid scroll-mt-32 gap-8 md:grid-cols-[300px_1fr]">
        <div>
          <h2 className="text-2xl font-bold">Customer reviews</h2>
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
                  <span className="h-5 flex-1 overflow-hidden rounded border border-[#e3e6e6] bg-[#f0f2f2] shadow-inner">
                    <span className="block h-full bg-star" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-10 text-right text-link">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold">Top reviews</h3>
          <ul className="space-y-6">
            {p.reviews.map((r, i) => (
              <li key={i}>
                <div className="flex items-center gap-2 text-sm">
                  <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3e6e6] font-bold text-muted">
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
                <p className="text-xs font-bold text-star">Verified Purchase</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
