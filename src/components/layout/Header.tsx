import Link from 'next/link';
import { Suspense } from 'react';
import { byCategory, categories, categoryLabel } from '@/lib/products';
import { currentUser } from '@/lib/session';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { AccountMenu } from './AccountMenu';
import { CartLink } from './CartLink';
import { SideMenu } from './SideMenu';
import { WishlistLink } from './WishlistLink';
import { NavChips } from './NavChips';

export async function Header() {
  const user = await currentUser();
  const cats = categories.map(c => ({ slug: c, label: categoryLabel(c), thumb: byCategory(c, 1)[0]?.thumbnail }));

  return (
    <header className="sticky top-0 z-40 bg-ink/95 text-white shadow-[0_1px_0_rgba(255,255,255,.06)] backdrop-blur supports-[backdrop-filter]:bg-ink/85">
      <div className="gutter flex items-center gap-2 py-2.5 sm:gap-4">
        <Suspense fallback={<span className="h-10 w-10" />}>
          <SideMenu categories={cats} userName={user?.name ?? null} />
        </Suspense>

        <Link href="/" className="shrink-0 rounded-lg px-1 py-1 text-[22px] leading-none sm:text-2xl" aria-label="Shopora home">
          <Logo />
        </Link>

        <div className="mx-2 hidden min-w-0 flex-1 md:block lg:mx-6">
          <Suspense fallback={<div className="h-11 rounded-full bg-white" />}>
            <SearchBar categories={cats} />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
          <Link href="/" className="nav-hover hidden items-center gap-2 px-2.5 py-1.5 xl:flex">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white/80 stroke-2">
              <path d="M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span className="leading-tight">
              <span className="block text-[11px] text-white/60">{user ? `Deliver to ${user.name.split(' ')[0]}` : 'Deliver to'}</span>
              <span className="block text-sm font-semibold">United States</span>
            </span>
          </Link>
          <AccountMenu user={user} />
          <WishlistLink />
          <CartLink />
        </div>
      </div>

      <div className="gutter pb-2.5 md:hidden">
        <Suspense fallback={<div className="h-11 rounded-full bg-white" />}>
          <SearchBar categories={cats} />
        </Suspense>
      </div>

      <nav aria-label="Departments" className="border-t border-white/[.07]">
        <Suspense fallback={<div className="h-11" />}>
          <NavChips />
        </Suspense>
      </nav>
    </header>
  );
}
