'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Cat = { slug: string; label: string; thumb?: string };

const QUICK = [
  { href: '/s?deals=1&sort=discount', label: "Today's Deals", emoji: '🔥', tint: 'from-[#fff1eb] to-[#ffe2d6]' },
  { href: '/s?sort=rating', label: 'Best Sellers', emoji: '⭐', tint: 'from-[#fff8e1] to-[#ffefb8]' },
  { href: '/wishlist', label: 'Wishlist', emoji: '💜', tint: 'from-brand-50 to-brand-100' },
  { href: '/orders', label: 'Your Orders', emoji: '📦', tint: 'from-mint-50 to-[#cdf3e3]' },
];

/**
 * Department drawer. Rendered through a portal into <body>: the sticky header uses
 * backdrop-filter, which makes it the containing block for position:fixed descendants,
 * so an in-header drawer would be clipped to the header's height.
 */
export function SideMenu({ categories, userName }: { categories: Cat[]; userName: string | null }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname, params]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      trigger?.focus();
    };
  }, [open]);

  const first = userName?.split(' ')[0];

  const drawer = (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Browse departments">
      <button aria-label="Close menu" tabIndex={-1} className="backdrop" onClick={() => setOpen(false)} />
      <div className="absolute inset-y-0 left-0 flex w-[min(400px,88vw)] animate-[slide-in_.28s_cubic-bezier(.2,.8,.2,1)] flex-col bg-page text-ink shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-3 to-brand-700 px-5 pt-5 pb-6 text-white">
          <span aria-hidden className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-brand/50 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cff] to-coral text-lg font-bold">
                {first ? first[0].toUpperCase() : '👋'}
              </span>
              <div>
                <p className="text-xs text-white/60">{first ? 'Welcome back' : 'Welcome to Kyro'}</p>
                <p className="text-lg font-bold">{first ? `Hi, ${first}` : 'Hello there'}</p>
              </div>
            </div>
            <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close menu" className="icon-btn bg-white/10 hover:bg-white/20">
              ×
            </button>
          </div>
          {!first && (
            <div className="relative mt-4 grid grid-cols-2 gap-2">
              <Link href="/signin" className="rounded-xl bg-white py-2 text-center text-sm font-bold text-ink transition hover:bg-brand-50">
                Sign in
              </Link>
              <Link href="/register" className="rounded-xl bg-white/10 py-2 text-center text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/20">
                Create account
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
          <div className="grid grid-cols-2 gap-2">
            {QUICK.map((q, i) => (
              <Link
                key={q.href}
                href={q.href}
                style={{ animationDelay: `${60 + i * 40}ms` }}
                className={`flex animate-[fade-up_.35s_ease-out_both] items-center gap-2 rounded-2xl bg-gradient-to-br ${q.tint} p-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]`}
              >
                <span aria-hidden className="text-lg">{q.emoji}</span>
                {q.label}
              </Link>
            ))}
          </div>

          <h2 className="mt-6 mb-2 px-1 text-xs font-bold tracking-wider text-muted uppercase">Shop by department</h2>
          <ul className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]">
            {categories.map((c, i) => (
              <li key={c.slug} style={{ animationDelay: `${120 + i * 18}ms` }} className="animate-[fade-up_.35s_ease-out_both] border-b border-line last:border-0">
                <Link href={`/s?category=${c.slug}`} className="group flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium transition hover:bg-brand-50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f4f8]">
                    {c.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.thumb} alt="" className="h-8 w-8 object-contain mix-blend-multiply transition group-hover:scale-110" />
                    )}
                  </span>
                  <span className="flex-1">{c.label}</span>
                  <span aria-hidden className="text-muted transition group-hover:translate-x-1 group-hover:text-brand">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="nav-hover group flex h-10 w-10 items-center justify-center"
        aria-label="Open all departments menu"
      >
        <span aria-hidden className="flex w-5 flex-col gap-[5px]">
          <span className="h-0.5 w-5 rounded-full bg-white transition-all group-hover:w-3.5" />
          <span className="h-0.5 w-5 rounded-full bg-white" />
          <span className="h-0.5 w-3.5 rounded-full bg-white transition-all group-hover:w-5" />
        </span>
      </button>
      {mounted && open && createPortal(drawer, document.body)}
    </>
  );
}
