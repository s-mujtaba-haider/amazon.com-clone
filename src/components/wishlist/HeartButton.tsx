'use client';

import { useWishlist, type WishItem } from './WishlistProvider';

export function HeartButton({ item, className = '', size = 'md' }: { item: WishItem; className?: string; size?: 'md' | 'lg' }) {
  const { has, toggle, ready } = useWishlist();
  const on = ready && has(item.id);
  const dim = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${item.title} from wishlist` : `Save ${item.title} to wishlist`}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={`flex ${dim} items-center justify-center rounded-full bg-white/90 shadow-[var(--shadow-soft)] backdrop-blur transition hover:scale-110 ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${on ? 'animate-[pop_.3s_ease-out] fill-deal stroke-deal' : 'fill-none stroke-[#334155]'}`}
        strokeWidth="2"
      >
        <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
