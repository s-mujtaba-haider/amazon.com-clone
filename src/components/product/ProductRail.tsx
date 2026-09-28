'use client';

import { Children, useRef } from 'react';

/** Horizontally scrolling row of (server-rendered) cards with arrow controls. */
export function ProductRail({ children, itemClassName = 'w-[46%] sm:w-[220px] 2xl:w-[240px]' }: { children: React.ReactNode; itemClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' });

  return (
    <div className="group/rail relative">
      <div ref={ref} className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-3 px-3 py-2 sm:-mx-1 sm:gap-4 sm:px-1">
        {Children.map(children, child => <div className={`shrink-0 snap-start ${itemClassName}`}>{child}</div>)}
      </div>
      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute top-1/2 -left-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-[var(--shadow-lift)] transition hover:scale-105 focus-visible:opacity-100 sm:flex sm:opacity-0 sm:group-hover/rail:opacity-100"
      >
        ‹
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute top-1/2 -right-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-[var(--shadow-lift)] transition hover:scale-105 focus-visible:opacity-100 sm:flex sm:opacity-0 sm:group-hover/rail:opacity-100"
      >
        ›
      </button>
    </div>
  );
}
