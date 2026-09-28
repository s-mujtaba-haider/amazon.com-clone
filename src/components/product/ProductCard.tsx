import Link from 'next/link';
import type { Product } from '@/lib/types';
import { listPrice, money, priceParts } from '@/lib/format';
import { HeartButton } from '@/components/wishlist/HeartButton';
import { QuickAdd } from './QuickAdd';

export function ProductCard({ p, deliveryLabel, priority = false }: { p: Product; deliveryLabel: string; priority?: boolean }) {
  const isDeal = p.discountPercentage >= 10;
  const { whole, cents } = priceParts(p.price);
  const cartProduct = { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-black/[.03] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="relative">
        <Link
          href={`/dp/${p.id}`}
          className="flex aspect-square items-center justify-center bg-gradient-to-b from-[#f6f7fb] to-[#eef0f7] p-5"
          tabIndex={-1}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.thumbnail}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.07]"
          />
        </Link>

        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1">
          {isDeal && <span className="rounded-full bg-deal px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">-{Math.round(p.discountPercentage)}%</span>}
          {p.rating >= 4.5 && <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">Top rated</span>}
        </div>

        <HeartButton
          item={{ ...cartProduct, discountPercentage: p.discountPercentage, rating: p.rating }}
          className="absolute top-2 right-2 z-10"
        />

        {p.stock > 0 && p.stock <= 10 && (
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-deal shadow-sm backdrop-blur">
            Only {p.stock} left
          </span>
        )}

        <QuickAdd product={cartProduct} className="absolute right-2.5 bottom-2.5" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {p.brand && <span className="truncate text-[11px] font-semibold tracking-wider text-muted uppercase">{p.brand}</span>}
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-ink sm:text-[15px]">
          <Link href={`/dp/${p.id}`} className="after:absolute after:inset-0 after:z-0 hover:text-brand">
            {p.title}
          </Link>
        </h3>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-mint-50 px-1.5 py-0.5 font-bold text-success">
            <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 fill-current">
              <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
            </svg>
            {p.rating.toFixed(1)}
          </span>
          <span className="text-muted">
            ({p.reviews.length} review{p.reviews.length === 1 ? '' : 's'})
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="flex items-start leading-none text-ink" aria-label={money(p.price)}>
            <span aria-hidden className="mt-0.5 text-xs font-semibold">$</span>
            <span aria-hidden className="text-xl font-extrabold sm:text-[22px]">{whole}</span>
            <span aria-hidden className="mt-0.5 text-xs font-semibold">{cents}</span>
          </span>
          {isDeal && <span className="text-xs text-muted line-through">{money(listPrice(p.price, p.discountPercentage))}</span>}
        </div>

        <p className="flex items-center gap-1 text-[11px] text-muted sm:text-xs">
          <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-none stroke-success stroke-2">
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" strokeLinejoin="round" />
            <circle cx="7" cy="17.5" r="1.5" />
            <circle cx="17" cy="17.5" r="1.5" />
          </svg>
          <span className="truncate">
            {p.price >= 35 ? <b className="font-semibold text-success">Free delivery</b> : 'Delivery'} {deliveryLabel.split(', ').slice(0, 2).join(', ')}
          </span>
        </p>
      </div>
    </article>
  );
}
