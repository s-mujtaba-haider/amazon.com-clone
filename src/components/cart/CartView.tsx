'use client';

import Link from 'next/link';
import { FREE_SHIPPING_MIN, money } from '@/lib/format';
import type { CartItem } from '@/lib/types';
import { QuantityPicker } from '@/components/product/QuantityPicker';
import { MAX_QTY, useCart } from './CartProvider';

export function CartView({ signedIn }: { signedIn: boolean }) {
  const { items, saved, ready, count, subtotal, setQty, remove, saveForLater, moveToCart, removeSaved } = useCart();

  if (!ready) {
    return (
      <div className="gutter flex flex-col gap-5 py-5 sm:py-8 lg:flex-row" aria-busy="true">
        <div className="skeleton h-80 flex-1 rounded-3xl" />
        <div className="skeleton h-48 rounded-3xl lg:w-[360px]" />
      </div>
    );
  }

  const toFree = FREE_SHIPPING_MIN - subtotal;
  const itemsLabel = `${count} ${count === 1 ? 'item' : 'items'}`;

  return (
    <div className="gutter flex flex-col gap-5 py-5 sm:py-8 lg:flex-row lg:items-start xl:gap-8">
      <div className="min-w-0 flex-1 space-y-5">
        <section className="card" data-reveal>
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center sm:flex-row sm:text-left">
              <span className="empty-icon h-28 w-28 shrink-0">
                <svg aria-hidden viewBox="0 0 24 24" className="h-12 w-12 fill-none stroke-brand stroke-[1.6]">
                  <path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 8H6.3" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx="9.5" cy="19.5" r="1.4" />
                  <circle cx="17" cy="19.5" r="1.4" />
                </svg>
              </span>
              <div>
                <h1 className="page-title">Your cart is empty</h1>
                <p className="mt-1 text-sm text-muted">Fill it with something you love.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <Link href="/s?deals=1&sort=discount" className="btn-cta">
                    Shop today&apos;s deals
                  </Link>
                  {!signedIn && (
                    <Link href="/signin?next=/cart" className="btn-secondary">
                      Sign in to see your cart
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between border-b border-line pb-2">
                <h1 className="page-title">Shopping cart</h1>
                <span className="hidden text-sm text-muted sm:block">Price</span>
              </div>
              <ul>
                {items.map(i => (
                  <CartRow key={i.id} item={i}>
                    <QuantityPicker size="sm" value={i.qty} max={Math.min(MAX_QTY, i.stock)} onChange={q => setQty(i.id, q)} onRemove={() => remove(i.id)} />
                    <Sep />
                    <button className="link" onClick={() => remove(i.id)}>Delete</button>
                    <Sep />
                    <button className="link" onClick={() => saveForLater(i.id)}>Save for later</button>
                  </CartRow>
                ))}
              </ul>
              <p className="border-t border-line pt-3 text-right text-lg">
                Subtotal ({itemsLabel}): <b>{money(subtotal)}</b>
              </p>
            </>
          )}
        </section>

        {saved.length > 0 && (
          <section id="saved" data-reveal className="card scroll-mt-32">
            <h2 className="section-title title-bar mb-2 border-b border-line pb-2">Saved for later ({saved.length} {saved.length === 1 ? 'item' : 'items'})</h2>
            <ul>
              {saved.map(i => (
                <CartRow key={i.id} item={i}>
                  <button className="btn-secondary px-3 py-1 text-xs" onClick={() => moveToCart(i.id)}>
                    Move to cart
                  </button>
                  <Sep />
                  <button className="link" onClick={() => removeSaved(i.id)}>Delete</button>
                </CartRow>
              ))}
            </ul>
          </section>
        )}
      </div>

      {items.length > 0 && (
        <aside data-reveal="right" className="card w-full space-y-4 lg:sticky lg:top-36 lg:w-[360px]">
          {toFree > 0 ? (
            <div className="text-sm">
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#eef0f6]">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-coral transition-[width] duration-700 ease-out" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)}%` }} />
              </div>
              Add <b className="text-deal">{money(toFree)}</b> of eligible items to your order to qualify for FREE delivery.
            </div>
          ) : (
            <p className="flex gap-1 text-sm text-success">
              <span aria-hidden>✔</span>
              <span>
                Your order qualifies for <b>FREE delivery</b>. <span className="text-ink">Choose this option at checkout.</span>
              </span>
            </p>
          )}
          <p className="text-lg">
            Subtotal ({itemsLabel}): <b>{money(subtotal)}</b>
          </p>
          <Link href="/checkout" className="btn-cta w-full py-3 text-base">
            Proceed to checkout
          </Link>
        </aside>
      )}
    </div>
  );
}

function Sep() {
  return <span aria-hidden className="h-4 border-l border-line" />;
}

function CartRow({ item, children }: { item: CartItem; children: React.ReactNode }) {
  return (
    <li className="flex animate-[fade-up_.35s_ease-out_both] gap-4 border-b border-line py-5 last:border-0">
      <Link href={`/dp/${item.id}`} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#f6f7fb] to-[#eef0f7] p-2 sm:h-36 sm:w-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.thumbnail} alt={item.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition duration-500 hover:scale-105" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-4">
          <Link href={`/dp/${item.id}`} className="line-clamp-2 text-[15px] leading-snug font-semibold hover:text-brand sm:text-lg">
            {item.title}
          </Link>
          <b className="hidden text-lg font-extrabold sm:block">{money(item.price)}</b>
        </div>
        <b className="sm:hidden">{money(item.price)}</b>
        <p className={`text-xs ${item.stock <= 10 ? 'text-deal' : 'text-success'}`}>{item.stock <= 10 ? `Only ${item.stock} left in stock` : 'In Stock'}</p>
        {item.brand && <p className="text-xs text-muted">Brand: {item.brand}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">{children}</div>
      </div>
    </li>
  );
}
