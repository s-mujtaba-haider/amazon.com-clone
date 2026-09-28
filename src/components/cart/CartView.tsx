'use client';

import Link from 'next/link';
import { FREE_SHIPPING_MIN, money } from '@/lib/format';
import type { CartItem } from '@/lib/types';
import { MAX_QTY, useCart } from './CartProvider';

export function CartView({ signedIn }: { signedIn: boolean }) {
  const { items, saved, ready, count, subtotal, setQty, remove, saveForLater, moveToCart, removeSaved } = useCart();

  if (!ready) {
    return <div className="mx-auto h-96 max-w-[1500px] animate-pulse p-5" aria-busy="true" />;
  }

  const toFree = FREE_SHIPPING_MIN - subtotal;
  const itemsLabel = `${count} ${count === 1 ? 'item' : 'items'}`;

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5 p-3 sm:p-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-5">
        <section className="card">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-6 sm:flex-row">
              <svg aria-hidden viewBox="0 0 120 90" className="h-32 w-44 shrink-0">
                <path d="M8 14h18l14 48h58l12-36H34" fill="none" stroke="#febd69" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx="46" cy="78" r="7" fill="#232f3e" />
                <circle cx="90" cy="78" r="7" fill="#232f3e" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Your Shopora Cart is empty</h1>
                <Link href="/s?deals=1&sort=discount" className="link text-sm">
                  Shop today&apos;s deals
                </Link>
                {!signedIn && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/signin?next=/cart" className="btn-cta">
                      Sign in to your account
                    </Link>
                    <Link href="/register?next=/cart" className="btn-secondary">
                      Sign up now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between border-b border-line pb-2">
                <h1 className="text-[28px] leading-tight font-normal">Shopping Cart</h1>
                <span className="hidden text-sm text-muted sm:block">Price</span>
              </div>
              <ul>
                {items.map(i => (
                  <CartRow key={i.id} item={i}>
                    <QtyStepper qty={i.qty} max={Math.min(MAX_QTY, i.stock)} onChange={q => setQty(i.id, q)} />
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
          <section id="saved" className="card scroll-mt-32">
            <h2 className="border-b border-line pb-2 text-xl font-bold">Saved for later ({saved.length} {saved.length === 1 ? 'item' : 'items'})</h2>
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
        <aside className="card w-full space-y-3 lg:sticky lg:top-32 lg:w-[300px]">
          {toFree > 0 ? (
            <div className="text-sm">
              <div className="mb-1 h-2 overflow-hidden rounded-full bg-[#e3e6e6]">
                <div className="h-full bg-success" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)}%` }} />
              </div>
              Add <b className="text-deal">{money(toFree)}</b> of eligible items to your order to qualify for FREE delivery.
            </div>
          ) : (
            <p className="flex gap-1 text-sm text-success">
              <span aria-hidden>✔</span>
              <span>
                Your order qualifies for <b>FREE delivery</b>. <span className="text-[#0f1111]">Choose this option at checkout.</span>
              </span>
            </p>
          )}
          <p className="text-lg">
            Subtotal ({itemsLabel}): <b>{money(subtotal)}</b>
          </p>
          <Link href="/checkout" className="btn-cta w-full rounded-lg py-2">
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
    <li className="flex gap-4 border-b border-line py-4 last:border-0">
      <Link href={`/dp/${item.id}`} className="flex h-28 w-28 shrink-0 items-center justify-center sm:h-44 sm:w-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.thumbnail} alt={item.title} className="max-h-full max-w-full object-contain" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-4">
          <Link href={`/dp/${item.id}`} className="line-clamp-2 text-base leading-snug hover:text-link-hover sm:text-lg">
            {item.title}
          </Link>
          <b className="hidden text-lg sm:block">{money(item.price)}</b>
        </div>
        <b className="sm:hidden">{money(item.price)}</b>
        <p className={`text-xs ${item.stock <= 10 ? 'text-deal' : 'text-success'}`}>{item.stock <= 10 ? `Only ${item.stock} left in stock` : 'In Stock'}</p>
        {item.brand && <p className="text-xs text-muted">Brand: {item.brand}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">{children}</div>
      </div>
    </li>
  );
}

function QtyStepper({ qty, max, onChange }: { qty: number; max: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border-[3px] border-cta">
      <button aria-label={qty === 1 ? 'Delete item' : 'Decrease quantity'} onClick={() => onChange(qty - 1)} className="flex h-7 w-8 items-center justify-center hover:bg-[#fff6c8]">
        {qty === 1 ? (
          <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#0f1111]">
            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Z" />
          </svg>
        ) : (
          '−'
        )}
      </button>
      <span className="w-8 text-center text-sm font-bold" aria-live="polite">{qty}</span>
      <button aria-label="Increase quantity" disabled={qty >= max} onClick={() => onChange(qty + 1)} className="flex h-7 w-8 items-center justify-center hover:bg-[#fff6c8] disabled:opacity-30">
        +
      </button>
    </div>
  );
}
