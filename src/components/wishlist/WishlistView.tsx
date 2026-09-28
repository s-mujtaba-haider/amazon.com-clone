'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { money } from '@/lib/format';
import { useWishlist } from './WishlistProvider';

export function WishlistView() {
  const { items, ready, remove } = useWishlist();
  const { add } = useCart();

  if (!ready) return <div className="gutter h-96 animate-pulse py-6" aria-busy="true" />;

  return (
    <div className="gutter py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Your wishlist</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} saved {items.length === 1 ? 'item' : 'items'} · saved on this device
          </p>
        </div>
        {items.length > 1 && (
          <button
            className="btn-cta"
            onClick={() => items.forEach(i => i.stock > 0 && add(i, 1))}
          >
            Add all to cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-[var(--shadow-soft)]">
          <span aria-hidden className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-coral-50 text-4xl">♡</span>
          <h2 className="mt-5 text-xl font-extrabold">Nothing saved yet</h2>
          <p className="mt-2 text-muted">Tap the heart on any product to keep it here for later.</p>
          <Link href="/s?sort=rating" className="btn-cta mt-6 px-6 py-3">
            Discover best sellers
          </Link>
        </div>
      ) : (
        <ul className="product-grid">
          {items.map(i => (
            <li key={i.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]">
              <Link href={`/dp/${i.id}`} className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-[#f6f7fb] to-[#eef0f7] p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.thumbnail} alt={i.title} className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105" />
                {i.discountPercentage >= 10 && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-deal px-2 py-0.5 text-[11px] font-bold text-white">-{Math.round(i.discountPercentage)}%</span>
                )}
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
                {i.brand && <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">{i.brand}</span>}
                <Link href={`/dp/${i.id}`} className="line-clamp-2 text-[15px] leading-snug font-semibold hover:text-brand">
                  {i.title}
                </Link>
                <b className="text-xl font-extrabold">{money(i.price)}</b>
                <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-1">
                  <button className="btn-cta" disabled={i.stock <= 0} onClick={() => add(i, 1)}>
                    {i.stock > 0 ? (
                      <>
                        <span className="sm:hidden">Add</span>
                        <span className="hidden sm:inline">Add to cart</span>
                      </>
                    ) : (
                      'Unavailable'
                    )}
                  </button>
                  <button className="btn-secondary px-3" aria-label={`Remove ${i.title} from wishlist`} onClick={() => remove(i.id)}>
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
