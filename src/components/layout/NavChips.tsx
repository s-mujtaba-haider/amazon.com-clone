'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const LINKS = [
  { href: '/s?deals=1&sort=discount', label: "Today's Deals", icon: '🔥', key: 'deals' },
  { href: '/s?sort=rating', label: 'Best Sellers', icon: '⭐', key: 'best' },
  { href: '/s?category=smartphones', label: 'Phones', key: 'smartphones' },
  { href: '/s?category=laptops', label: 'Laptops', key: 'laptops' },
  { href: '/s?category=tablets', label: 'Tablets', key: 'tablets' },
  { href: '/s?category=mobile-accessories', label: 'Accessories', key: 'mobile-accessories' },
  { href: '/s?category=groceries', label: 'Grocery', key: 'groceries' },
  { href: '/s?category=beauty', label: 'Beauty', key: 'beauty' },
  { href: '/s?category=skin-care', label: 'Skin Care', key: 'skin-care' },
  { href: '/s?category=fragrances', label: 'Fragrances', key: 'fragrances' },
  { href: '/s?category=furniture', label: 'Furniture', key: 'furniture' },
  { href: '/s?category=home-decoration', label: 'Home Décor', key: 'home-decoration' },
  { href: '/s?category=kitchen-accessories', label: 'Kitchen', key: 'kitchen-accessories' },
  { href: '/s?category=womens-dresses', label: 'Women', key: 'womens-dresses' },
  { href: '/s?category=mens-shirts', label: 'Men', key: 'mens-shirts' },
  { href: '/s?category=womens-watches', label: 'Watches', key: 'womens-watches' },
  { href: '/s?category=sunglasses', label: 'Sunglasses', key: 'sunglasses' },
  { href: '/s?category=sports-accessories', label: 'Sports', key: 'sports-accessories' },
  { href: '/s?category=vehicle', label: 'Automotive', key: 'vehicle' },
];

export function NavChips() {
  const pathname = usePathname();
  const params = useSearchParams();
  const cat = params.get('category');
  const activeKey = pathname !== '/s' ? null : cat ?? (params.get('deals') ? 'deals' : params.get('sort') === 'rating' ? 'best' : null);

  return (
    <div className="gutter no-scrollbar flex items-center gap-1.5 overflow-x-auto py-2 text-[13px] whitespace-nowrap">
      {LINKS.map(l => {
        const on = activeKey === l.key;
        return (
          <Link
            key={l.key}
            href={l.href}
            aria-current={on ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${on ? 'bg-white text-ink' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
          >
            {l.icon && <span aria-hidden className="mr-1">{l.icon}</span>}
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
