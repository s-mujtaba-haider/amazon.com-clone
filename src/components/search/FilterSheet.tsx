'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Mobile-only bottom sheet that hosts the same filter panel the desktop sidebar shows.
 * Portaled into <body> like the side menu, so no transformed or scrolling ancestor can clip it.
 */
export function FilterSheet({ activeCount, resultCount, children }: { activeCount: number; resultCount: number; children: React.ReactNode }) {
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [open]);

  const sheet = (
    <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <button aria-label="Close filters" tabIndex={-1} className="backdrop" onClick={() => setOpen(false)} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] animate-[sheet-up_.3s_cubic-bezier(.2,.8,.2,1)] flex-col rounded-t-3xl bg-white shadow-2xl">
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-extrabold">
            Filters {activeCount > 0 && <span className="text-sm font-semibold text-brand">({activeCount} on)</span>}
          </h2>
          <button ref={closeRef} onClick={() => setOpen(false)} className="icon-btn bg-[#f5f6fa] text-muted hover:text-ink" aria-label="Close filters">
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 text-[15px]">{children}</div>
        <div className="border-t border-line p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button onClick={() => setOpen(false)} className="btn-cta w-full py-3 text-base">
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className="chip border-ink bg-ink text-white hover:border-ink hover:bg-ink-3 md:hidden">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && <span className="count-badge">{activeCount}</span>}
      </button>
      {mounted && open && createPortal(sheet, document.body)}
    </>
  );
}
