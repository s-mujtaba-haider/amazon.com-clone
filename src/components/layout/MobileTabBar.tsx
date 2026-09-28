'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';

const icon = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  shop: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  deals: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  user: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm-8 9c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z',
  cart: 'M3 4h3l2.7 11h10.6L22 7H7.3M10 20.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z',
};

/** App-style bottom navigation for phones: the four things people actually do on mobile. */
export function MobileTabBar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { count, ready } = useCart();

  const tabs = [
    { href: '/', label: 'Home', d: icon.home, active: pathname === '/' },
    { href: '/s', label: 'Shop', d: icon.shop, active: pathname === '/s' || pathname.startsWith('/dp') },
    { href: '/s?deals=1&sort=discount', label: 'Deals', d: icon.deals, active: false },
    { href: signedIn ? '/orders' : '/signin', label: signedIn ? 'Orders' : 'Sign in', d: icon.user, active: pathname.startsWith('/orders') },
    { href: '/cart', label: 'Cart', d: icon.cart, active: pathname === '/cart', badge: ready && count > 0 ? count : 0 },
  ];

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map(t => (
          <li key={t.label}>
            <Link href={t.href} aria-current={t.active ? 'page' : undefined} className={`relative flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] ${t.active ? 'font-bold text-[#0f1111]' : 'text-muted'}`}>
              {t.active && <span aria-hidden className="absolute top-0 h-[3px] w-10 rounded-b bg-[#008296]" />}
              <svg aria-hidden viewBox="0 0 24 24" className={`h-6 w-6 ${t.label === 'Shop' || t.label === 'Home' || t.label === 'Deals' || t.label === 'Orders' || t.label === 'Sign in' ? (t.active ? 'fill-[#008296]' : 'fill-none stroke-muted stroke-[1.6]') : t.active ? 'fill-none stroke-[#008296] stroke-2' : 'fill-none stroke-muted stroke-[1.6]'}`}>
                <path d={t.d} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {t.label}
              {!!t.badge && <span className="absolute top-1 left-1/2 ml-1.5 min-w-[18px] rounded-full bg-cta-2 px-1 text-center text-[11px] leading-[18px] font-bold text-[#0f1111]">{t.badge > 99 ? '99+' : t.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
