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
        className="nav-hover px-2 py-1 text-left leading-tight"
      >
        <span className="block max-w-32 truncate text-xs">Hello, {first ?? 'sign in'}</span>
        <span className="flex items-center gap-1 text-sm font-bold">
          <span className="hidden whitespace-nowrap lg:inline">Account &amp; Lists</span>
          <span className="lg:hidden">Account</span>
          <svg aria-hidden viewBox="0 0 10 6" className="h-1.5 w-2 fill-gray-400">
            <path d="M0 0h10L5 6z" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-1 w-72 rounded-sm bg-white p-4 text-[#0f1111] shadow-[0_4px_20px_rgba(0,0,0,.35)] sm:w-96">
          <span aria-hidden className="absolute -top-2 right-10 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-white" />
          {user ? (
            <div className="mb-3 rounded-md bg-[#f3f3f3] p-3 text-sm">
              Signed in as <b>{user.name}</b>
              <span className="block truncate text-xs text-muted">{user.email}</span>
            </div>
          ) : (
            <div className="mb-3 border-b border-line pb-3 text-center">
              <Link href={`/signin?next=${encodeURIComponent(next)}`} className="btn-cta w-56">
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
              <ul className="space-y-1 text-[13px] text-[#444]">
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
              <ul className="space-y-1 text-[13px] text-[#444]">
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
