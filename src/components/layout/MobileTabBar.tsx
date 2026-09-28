'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

const icon = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  shop: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  heart: 'M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z',
  user: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm-8 9c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z',
  cart: 'M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 8H6.3',
};

/** App-style bottom navigation for phones. */
export function MobileTabBar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const wish = useWishlist();

  const tabs = [
    { href: '/', label: 'Home', d: icon.home, active: pathname === '/', badge: 0 },
    { href: '/s', label: 'Shop', d: icon.shop, active: pathname === '/s' || pathname.startsWith('/dp'), badge: 0 },
    { href: '/wishlist', label: 'Wishlist', d: icon.heart, active: pathname === '/wishlist', badge: wish.ready ? wish.items.length : 0 },
    { href: signedIn ? '/orders' : '/signin', label: signedIn ? 'Orders' : 'Account', d: icon.user, active: pathname.startsWith('/orders'), badge: 0 },
    { href: '/cart', label: 'Cart', d: icon.cart, active: pathname === '/cart', badge: ready ? count : 0 },
  ];

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map(t => (
          <li key={t.label}>
            <Link
              href={t.href}
              aria-current={t.active ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] font-semibold transition-colors ${t.active ? 'text-brand' : 'text-[#64748b]'}`}
            >
              <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${t.active ? 'bg-brand-50' : ''}`}>
                <svg aria-hidden viewBox="0 0 24 24" className={`h-[22px] w-[22px] stroke-current stroke-2 ${t.active && t.label !== 'Cart' && t.label !== 'Shop' ? 'fill-current' : 'fill-none'}`}>
                  <path d={t.d} strokeLinejoin="round" strokeLinecap="round" />
                  {t.label === 'Cart' && (
                    <>
                      <circle cx="9.5" cy="19.5" r="1.3" />
                      <circle cx="17" cy="19.5" r="1.3" />
                    </>
                  )}
                </svg>
              </span>
              {t.label}
              {t.badge > 0 && (
                <span className="absolute top-1 left-1/2 ml-2 min-w-[18px] rounded-full bg-coral px-1 text-center text-[10px] leading-[18px] font-bold text-white ring-2 ring-white">
                  {t.badge > 99 ? '99+' : t.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
