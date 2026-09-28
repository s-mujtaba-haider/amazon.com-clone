'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import type { CartProduct } from '@/lib/types';

/** Floating one-tap add-to-cart on product images. Always visible on touch, revealed on hover with a mouse. */
export function QuickAdd({ product, className = '' }: { product: CartProduct; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  if (product.stock <= 0) return null;

  return (
    <button
      type="button"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        add(product, 1);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      aria-label={`Add ${product.title} to cart`}
      className={`z-10 flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold shadow-[var(--shadow-lift)] transition-all duration-200 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:translate-y-0 [@media(hover:hover)]:focus-visible:opacity-100 ${
        done ? 'bg-success text-white' : 'bg-ink text-white hover:bg-brand'
      } ${className}`}
    >
      {done ? (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white stroke-[3]">
          <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white stroke-[2.5]">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      )}
      <span className="hidden sm:inline">{done ? 'Added' : 'Add'}</span>
    </button>
  );
}
