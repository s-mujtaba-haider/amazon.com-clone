'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import type { CartProduct } from '@/lib/types';

export function AddToCartButton({ product, qty = 1, compact = false, className = '' }: { product: CartProduct; qty?: number; compact?: boolean; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  if (product.stock <= 0) {
    return <p className="text-sm text-deal">Currently unavailable.</p>;
  }

  return (
    <button
      type="button"
      className={`btn-cta ${compact ? 'px-3 py-1 text-[13px]' : 'w-full'} ${className}`}
      onClick={() => {
        add(product, qty);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? '✓ Added' : 'Add to cart'}
    </button>
  );
}
