import Link from 'next/link';
import { Suspense } from 'react';
import { categories, categoryLabel } from '@/lib/products';
import { currentUser } from '@/lib/session';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { AccountMenu } from './AccountMenu';
import { CartLink } from './CartLink';
import { SideMenu } from './SideMenu';

const QUICK_LINKS = [
  { href: '/s?deals=1&sort=discount', label: "Today's Deals" },
  { href: '/s?sort=rating', label: 'Best Sellers' },
  { href: '/s?category=smartphones', label: 'Smartphones' },
  { href: '/s?category=laptops', label: 'Laptops' },
  { href: '/s?category=groceries', label: 'Grocery' },
  { href: '/s?category=beauty', label: 'Beauty' },
  { href: '/s?category=furniture', label: 'Home' },
  { href: '/s?category=womens-dresses', label: 'Fashion' },
  { href: '/s?category=sports-accessories', label: 'Sports' },
  { href: '/s?category=vehicle', label: 'Automotive' },
];

export async function Header() {
  const user = await currentUser();
  const cats = categories.map(c => ({ slug: c, label: categoryLabel(c) }));

  return (
    <header className="sticky top-0 z-40 text-white">
      <div className="bg-nav">
        <div className="flex items-center gap-1 px-2 py-1.5 sm:gap-2 sm:px-3">
          <Link href="/" className="nav-hover shrink-0 px-2 py-1.5 text-2xl leading-none">
            <Logo />
          </Link>

          <Link href="/" className="nav-hover hidden shrink-0 items-end gap-1 px-2 py-1 lg:flex">
            <svg aria-hidden viewBox="0 0 24 24" className="mb-0.5 h-4 w-4 fill-white">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <span className="leading-tight">
              <span className="block text-xs text-gray-300">{user ? `Deliver to ${user.name.split(' ')[0]}` : 'Delivering to'}</span>
              <span className="block text-sm font-bold">United States</span>
            </span>
          </Link>

          <div className="hidden flex-1 md:block">
            <Suspense fallback={<div className="h-10 rounded-md bg-white" />}>
              <SearchBar categories={cats} />
            </Suspense>
          </div>

          <div className="ml-auto flex items-center md:ml-0">
            <AccountMenu user={user} />
            <Link href="/orders" className="nav-hover hidden px-2 py-1 leading-tight whitespace-nowrap lg:block">
              <span className="block text-xs">Returns</span>
              <span className="block text-sm font-bold">&amp; Orders</span>
            </Link>
            <CartLink />
          </div>
        </div>
        <div className="px-2 pb-2 md:hidden">
          <Suspense fallback={<div className="h-10 rounded-md bg-white" />}>
              <SearchBar categories={cats} />
            </Suspense>
        </div>
      </div>

      <nav aria-label="Departments" className="bg-nav-2">
        <div className="no-scrollbar flex items-center gap-0.5 overflow-x-auto px-2 py-1 text-sm whitespace-nowrap">
          <Suspense fallback={<span className="px-2 py-1 font-bold">All</span>}>
            <SideMenu categories={cats} userName={user?.name ?? null} />
          </Suspense>
          {QUICK_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="nav-hover px-2 py-1">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
