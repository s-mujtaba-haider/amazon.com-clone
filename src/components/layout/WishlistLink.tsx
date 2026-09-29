'use client';

import Link from 'next/link';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

export function WishlistLink() {
  const { items, ready } = useWishlist();
  const n = ready ? items.length : 0;
  return (
    <Link href="/wishlist" className="nav-hover relative hidden h-10 w-10 items-center justify-center sm:flex" aria-label={`Wishlist, ${n} items`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-white stroke-2">
        <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" strokeLinejoin="round" />
      </svg>
      {n > 0 && <span key={n} className="count-badge absolute -top-0.5 -right-0.5">{n > 99 ? '99+' : n}</span>}
    </Link>
  );
}
