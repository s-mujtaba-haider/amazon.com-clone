'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MAX_QTY, useCart } from '@/components/cart/CartProvider';
import { FREE_SHIPPING_MIN } from '@/lib/format';
import type { CartProduct } from '@/lib/types';
import { Price } from './Price';
import { AddToCartButton } from './AddToCartButton';

export function BuyBox({
  product,
  delivery,
  fastest,
  availability,
  returnPolicy,
}: {
  product: CartProduct;
  delivery: string;
  fastest: string;
  availability: string;
  returnPolicy: string;
}) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const router = useRouter();
  const max = Math.min(MAX_QTY, product.stock);
  const inStock = product.stock > 0;
  const free = product.price >= FREE_SHIPPING_MIN;

  return (
    <aside className="h-fit overflow-hidden rounded-3xl bg-white p-5 text-sm shadow-[var(--shadow-lift)] ring-1 ring-black/[.03] md:col-span-2 lg:sticky lg:top-36 lg:col-span-1" aria-label="Buy box">
      <div className="-mx-5 -mt-5 mb-4 bg-gradient-to-br from-brand-50 to-coral-50 px-5 pt-5 pb-4">
        <Price price={product.price} showList={false} />
        <p className="mt-1 text-xs text-muted">Taxes calculated at checkout · Secure payment</p>
      </div>
      <p className="mt-3">
        {free ? (
          <>
            <span className="text-link">FREE delivery</span> <b>{delivery}</b>
          </>
        ) : (
          <>
            <span className="text-link">$5.99 delivery</span> <b>{delivery}</b>. Free on orders over ${FREE_SHIPPING_MIN}.
          </>
        )}
      </p>
      <p className="mt-2">
        Or fastest delivery <b>{fastest}</b> if you order today.
      </p>
      <p className="mt-2 flex items-center gap-1 text-xs">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-[#0f1111]">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
        </svg>
        <span className="text-link">Deliver to United States</span>
      </p>

      <p className={`mt-4 text-lg ${inStock ? (product.stock <= 10 ? 'text-deal' : 'text-success') : 'text-deal'}`}>
        {!inStock ? 'Currently unavailable' : product.stock <= 10 ? `Only ${product.stock} left in stock - order soon.` : availability}
      </p>

      {inStock && (
        <>
          <label className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-line bg-[#fafbfe] px-3 py-2 text-sm font-medium">
            Quantity:
            <select value={qty} onChange={e => setQty(Number(e.target.value))} className="cursor-pointer bg-transparent font-bold outline-none">
              {Array.from({ length: max }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 space-y-2">
            <AddToCartButton product={product} qty={qty} className="py-3 text-base" />
            <button
              type="button"
              className="btn-buy w-full py-3 text-base"
              onClick={() => {
                add(product, qty);
                router.push('/checkout');
              }}
            >
              Buy Now
            </button>
          </div>
        </>
      )}

      {inStock && (
        <div className="fixed inset-x-2 bottom-[calc(66px+env(safe-area-inset-bottom))] z-30 flex items-center gap-2 rounded-2xl bg-white/95 p-2.5 pl-4 shadow-[var(--shadow-lift)] ring-1 ring-black/5 backdrop-blur md:hidden">
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-none font-bold">${product.price.toFixed(2)}</p>
            <p className="truncate text-xs text-success">{free ? 'FREE delivery' : 'In stock'} · {delivery.split(', ')[1]}</p>
          </div>
          <AddToCartButton product={product} qty={qty} compact className="px-3.5 py-2.5 text-sm" />
          <button type="button" className="btn-buy px-3.5 py-2.5 text-sm" onClick={() => { add(product, qty); router.push('/checkout'); }}>
            Buy Now
          </button>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs">
        <dt className="text-muted">Ships from</dt>
        <dd>Shopora</dd>
        <dt className="text-muted">Sold by</dt>
        <dd>{product.brand ?? 'Shopora'}</dd>
        <dt className="text-muted">Returns</dt>
        <dd className="text-link">{returnPolicy}</dd>
        <dt className="text-muted">Payment</dt>
        <dd className="text-link">Secure transaction</dd>
      </dl>
    </aside>
  );
}
