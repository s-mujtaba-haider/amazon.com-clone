'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { money } from '@/lib/format';
import { useCart } from './CartProvider';

/** Confirmation flyout shown after "Add to cart", with a path straight to the cart or checkout. */
export function AddedToCartToast() {
  const { lastAdded, dismissAdded, subtotal, count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissAdded, 5000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissAdded]);

  useEffect(() => dismissAdded(), [pathname, dismissAdded]);

  if (!lastAdded) return null;

  return (
    <div role="status" aria-live="polite" className="fixed top-3 right-3 z-[70] w-[min(380px,calc(100vw-1.5rem))] animate-[toast-in_.2s_ease-out] rounded-3xl bg-white p-4 shadow-[var(--shadow-lift)] ring-1 ring-black/5 sm:top-5 sm:right-5">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lastAdded.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-2xl bg-[#f3f4f8] object-contain p-1 mix-blend-multiply" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 font-bold text-success">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-success">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z" />
            </svg>
            Added to cart
          </p>
          <p className="truncate text-sm">{lastAdded.title}</p>
          <p className="text-sm">
            Cart subtotal ({count} {count === 1 ? 'item' : 'items'}): <b>{money(subtotal)}</b>
          </p>
        </div>
        <button onClick={dismissAdded} aria-label="Dismiss" className="self-start text-xl leading-none text-muted hover:text-black">
          ×
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/cart" className="btn-secondary">
          Go to Cart
        </Link>
        <Link href="/checkout" className="btn-cta">
          Checkout
        </Link>
      </div>
    </div>
  );
}
