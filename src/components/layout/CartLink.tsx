'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { money } from '@/lib/format';

export function CartLink() {
  const { count, ready, subtotal } = useCart();
  const n = ready ? count : 0;
  return (
    <Link href="/cart" className="nav-hover flex items-center gap-2 px-2 py-1.5" aria-label={`Cart, ${n} items`}>
      <span className="relative flex h-9 w-9 items-center justify-center">
        <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-white stroke-2">
          <path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 8H6.3" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="9.5" cy="19.5" r="1.4" />
          <circle cx="17" cy="19.5" r="1.4" />
        </svg>
        <span
          key={n}
          className={`absolute -top-0.5 -right-1 flex h-[19px] min-w-[19px] animate-[pop_.3s_ease-out] items-center justify-center rounded-full px-1 text-[11px] font-bold ${n ? 'bg-coral text-white' : 'bg-white/15 text-white/70'}`}
        >
          {n > 99 ? '99+' : n}
        </span>
      </span>
      <span className="hidden leading-tight lg:block">
        <span className="block text-[11px] text-white/60">Cart</span>
        <span className="block text-sm font-semibold">{money(ready ? subtotal : 0)}</span>
      </span>
    </Link>
  );
}
