'use client';

import { useCart } from '@/components/cart/CartProvider';
import type { CartProduct } from '@/lib/types';

export function BuyAgainButton({ product }: { product: CartProduct }) {
  const { add } = useCart();
  return (
    <button onClick={() => add(product, 1)} className="btn-cta px-3 py-1 text-xs" disabled={product.stock <= 0}>
      <svg aria-hidden viewBox="0 0 24 24" className="mr-1 h-3.5 w-3.5 fill-none stroke-current stroke-2">
        <path d="M4 4v6h6M20 20v-6h-6M5 15a8 8 0 0 0 14 2M19 9A8 8 0 0 0 5 7" strokeLinecap="round" />
      </svg>
      Buy it again
    </button>
  );
}
