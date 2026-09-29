'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import type { CartProduct } from '@/lib/types';

/** Primary add-to-cart. Flips to a green "Added" with a check for a moment, same as QuickAdd. */
export function AddToCartButton({ product, qty = 1, compact = false, className = '' }: { product: CartProduct; qty?: number; compact?: boolean; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  if (product.stock <= 0) {
    return <p className="text-sm text-deal">Currently unavailable.</p>;
  }

  return (
    <button
      type="button"
      className={`btn-cta ${done ? 'bg-success hover:bg-success' : ''} ${compact ? 'px-3 py-1 text-[13px]' : 'w-full'} ${className}`}
      onClick={() => {
        add(product, qty);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      <span key={String(done)} className="inline-flex animate-[pop-in_.25s_ease-out] items-center gap-1.5">
        {done ? (
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[3]">
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 8H6.3" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="9.5" cy="19.5" r="1.4" />
            <circle cx="17" cy="19.5" r="1.4" />
          </svg>
        )}
        {done ? 'Added' : 'Add to cart'}
      </span>
    </button>
  );
}
