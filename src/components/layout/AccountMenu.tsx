'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '@/app/actions/auth';

type U = { name: string; email: string } | null;

const MENU = [
  { href: '/orders', label: 'Your orders', icon: '📦' },
  { href: '/wishlist', label: 'Wishlist', icon: '💜' },
  { href: '/cart', label: 'Cart', icon: '🛒' },
  { href: '/cart#saved', label: 'Saved for later', icon: '🔖' },
  { href: '/s?deals=1&sort=discount', label: "Today's deals", icon: '🔥' },
];

export function AccountMenu({ user }: { user: U }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  const first = user?.name.split(' ')[0];
  const next = pathname === '/signin' || pathname === '/register' ? '/' : pathname;

  return (
    <div
      ref={ref}
      className="relative"
      // hover opens it for mice only: on touch a tap fires mouseenter and click, which would open then close it
      onPointerEnter={e => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(timer.current);
        setOpen(true);
      }}
      onPointerLeave={e => {
        if (e.pointerType !== 'mouse') return;
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
            <svg aria-hidden viewBox="0 0 24 24" className={`h-3.5 w-3.5 fill-none stroke-white/60 stroke-[2.5] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div className="popover absolute top-[calc(100%+8px)] right-0 w-[min(20rem,calc(100vw-1.5rem))] origin-top-right p-3 sm:w-80">
          {user ? (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-50 to-coral-50 p-3 text-sm">
              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cff] to-coral font-bold text-white">
                {first?.[0].toUpperCase()}
              </span>
              <span className="min-w-0">
                <b className="block truncate">{user.name}</b>
                <span className="block truncate text-xs text-muted">{user.email}</span>
              </span>
            </div>
          ) : (
            <div className="mb-2 border-b border-line p-1 pb-3 text-center">
              <Link href={`/signin?next=${encodeURIComponent(next)}`} className="btn-cta w-full">
                Sign in
              </Link>
              <p className="mt-2 text-xs text-muted">
                New customer?{' '}
                <Link href={`/register?next=${encodeURIComponent(next)}`} className="link">
                  Create an account
                </Link>
              </p>
            </div>
          )}
          <ul className="space-y-0.5">
            {MENU.map((m, i) => (
              <li key={m.href} style={{ animationDelay: `${40 + i * 25}ms` }} className="animate-[fade-up_.25s_ease-out_both]">
                <Link href={m.href} onClick={() => setOpen(false)} className="menu-item">
                  <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f6fa] text-base">{m.icon}</span>
                  {m.label}
                </Link>
              </li>
            ))}
            {user && (
              <li className="mt-1 border-t border-line pt-1">
                <form action={signOut}>
                  <button className="menu-item text-deal hover:bg-[#fff1f1] focus-visible:bg-[#fff1f1]">
                    <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff1f1]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                        <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Sign out
                  </button>
                </form>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
