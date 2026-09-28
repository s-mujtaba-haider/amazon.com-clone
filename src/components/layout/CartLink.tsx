'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready ? (count > 99 ? '99+' : String(count)) : '0';
  return (
    <Link href="/cart" className="nav-hover flex items-end px-2 py-1" aria-label={`Cart, ${shown} items`}>
      <span className="relative">
        <svg aria-hidden viewBox="0 0 40 30" className="h-8 w-10 fill-none stroke-white stroke-2">
          <path d="M2 4h6l5 17h19l4-12H11" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="15" cy="26" r="2" className="fill-white" />
          <circle cx="29" cy="26" r="2" className="fill-white" />
        </svg>
        <span className="absolute -top-1.5 left-[19px] w-5 text-center text-base font-bold text-cta-2">{shown}</span>
      </span>
      <span className="hidden text-sm font-bold sm:inline">Cart</span>
    </Link>
  );
}
