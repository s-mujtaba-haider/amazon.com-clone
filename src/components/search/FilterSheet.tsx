'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Mobile-only bottom sheet that hosts the same filter panel the desktop sidebar shows. */
export function FilterSheet({ activeCount, resultCount, children }: { activeCount: number; resultCount: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => setOpen(false), [pathname, params]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="chip border-ink bg-ink text-white hover:bg-ink md:hidden">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-link text-xs text-white">{activeCount}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] animate-[sheet-up_.22s_ease-out] flex-col rounded-t-2xl bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span aria-hidden className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#ccc]" />
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none text-muted" aria-label="Close">
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-3 text-[15px] [&_a]:py-1.5">{children}</div>
            <div className="border-t border-line p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <button onClick={() => setOpen(false)} className="btn-cta w-full py-3">
                Show {resultCount} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
