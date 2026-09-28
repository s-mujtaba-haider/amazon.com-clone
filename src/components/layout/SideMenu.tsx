'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SideMenu({ categories, userName }: { categories: { slug: string; label: string }[]; userName: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => setOpen(false), [pathname, params]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="nav-hover flex h-10 w-10 items-center justify-center" aria-label="Open all categories menu">
        <svg aria-hidden viewBox="0 0 20 16" className="h-4 w-5 fill-white">
          <rect width="20" height="2" rx="1" />
          <rect y="7" width="20" height="2" rx="1" />
          <rect y="14" width="20" height="2" rx="1" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="All categories">
          <button aria-label="Close menu" className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(365px,85vw)] animate-[slide-in_.2s_ease-out] flex-col bg-white text-[#0f1111]">
            <div className="flex items-center gap-3 bg-gradient-to-br from-ink via-ink-3 to-brand-700 px-6 py-5 text-lg font-bold text-white">
              <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                <circle cx="12" cy="8" r="4.5" />
                <path d="M3 21c0-4.5 4-7 9-7s9 2.5 9 7z" />
              </svg>
              Hello, {userName?.split(' ')[0] ?? 'sign in'}
            </div>
            <div className="overflow-y-auto pb-6">
              <h2 className="px-6 pt-4 pb-2 text-lg font-bold">Trending</h2>
              <ul className="border-b border-line pb-2 text-sm">
                <li><Link className="block px-6 py-3 hover:bg-brand-50" href="/s?sort=rating">Best Sellers</Link></li>
                <li><Link className="block px-6 py-3 hover:bg-brand-50" href="/s?deals=1&sort=discount">Today&apos;s Deals</Link></li>
              </ul>
              <h2 className="px-6 pt-4 pb-2 text-lg font-bold">Shop by Department</h2>
              <ul className="border-b border-line pb-2 text-sm">
                {categories.map(c => (
                  <li key={c.slug}>
                    <Link className="flex items-center justify-between px-6 py-3 hover:bg-brand-50" href={`/s?category=${c.slug}`}>
                      {c.label}
                      <span aria-hidden className="text-muted">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="px-6 pt-4 pb-2 text-lg font-bold">Help &amp; Settings</h2>
              <ul className="text-sm">
                <li><Link className="block px-6 py-3 hover:bg-brand-50" href="/orders">Your Orders</Link></li>
                {!userName && <li><Link className="block px-6 py-3 hover:bg-brand-50" href="/signin">Sign in</Link></li>}
              </ul>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-3 left-[min(375px,calc(85vw+10px))] text-3xl leading-none text-white">
            ×
          </button>
        </div>
      )}
    </>
  );
}
