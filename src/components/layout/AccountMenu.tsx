'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '@/app/actions/auth';

type U = { name: string; email: string } | null;

export function AccountMenu({ user }: { user: U }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  const first = user?.name.split(' ')[0];
  const next = pathname === '/signin' || pathname === '/register' ? '/' : pathname;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setOpen(false), 150);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="nav-hover flex items-center gap-2 px-2 py-1.5 text-left leading-tight"
      >
        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cff] to-coral text-sm font-bold">{first ? first[0].toUpperCase() : <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6z" /></svg>}</span>
        <span className="hidden sm:block">
        <span className="block max-w-32 truncate text-[11px] text-white/60">Hello, {first ?? 'sign in'}</span>
        <span className="flex items-center gap-1 text-sm font-semibold">
          <span className="whitespace-nowrap">Account</span>
          <svg aria-hidden viewBox="0 0 10 6" className="h-1.5 w-2 fill-white/50">
            <path d="M0 0h10L5 6z" />
          </svg>
        </span>
        </span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] animate-[fade-up_.15s_ease-out] rounded-2xl border border-line bg-white p-4 text-ink shadow-[var(--shadow-lift)] sm:w-96">
                    {user ? (
            <div className="mb-3 rounded-xl bg-brand-50 p-3 text-sm">
              Signed in as <b>{user.name}</b>
              <span className="block truncate text-xs text-muted">{user.email}</span>
            </div>
          ) : (
            <div className="mb-3 border-b border-line pb-3 text-center">
              <Link href={`/signin?next=${encodeURIComponent(next)}`} className="btn-cta w-full">
                Sign in
              </Link>
              <p className="mt-2 text-xs">
                New customer?{' '}
                <Link href={`/register?next=${encodeURIComponent(next)}`} className="link">
                  Start here.
                </Link>
              </p>
            </div>
          )}
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <h3 className="mb-1 font-bold">Your Lists</h3>
              <ul className="space-y-1 text-sm text-[#475569]">
                <li>
                  <Link href="/wishlist" className="hover:text-link-hover hover:underline">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/cart#saved" className="hover:text-link-hover hover:underline">
                    Saved for later
                  </Link>
                </li>
                <li>
                  <Link href="/s?deals=1&sort=discount" className="hover:text-link-hover hover:underline">
                    Today&apos;s Deals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-1 font-bold">Your Account</h3>
              <ul className="space-y-1 text-sm text-[#475569]">
                <li>
                  <Link href="/orders" className="hover:text-link-hover hover:underline">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-link-hover hover:underline">
                    Cart
                  </Link>
                </li>
                {user && (
                  <li>
                    <form action={signOut}>
                      <button className="hover:text-link-hover hover:underline">Sign Out</button>
                    </form>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
