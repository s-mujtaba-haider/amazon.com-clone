'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Product } from '@/lib/types';

type Item = Pick<Product, 'id' | 'title' | 'thumbnail' | 'price' | 'discountPercentage'>;

/** Horizontal shelf of product images with scroll arrows. */
export function ProductCarousel({ title, items, href, showPrice = false }: { title: string; items: Item[]; href?: string; showPrice?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="rounded-lg bg-white p-4 sm:rounded-none sm:p-5">
      <div className="mb-3 flex items-baseline gap-4">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        {href && (
          <Link href={href} className="link text-sm">
            See all
          </Link>
        )}
      </div>
      <div className="group relative">
        <button aria-label="Scroll left" onClick={() => scroll(-1)} className="absolute top-1/2 left-0 z-10 hidden h-24 w-11 -translate-y-1/2 items-center justify-center rounded-r-md border border-line bg-white/95 text-2xl shadow group-hover:flex">
          ‹
        </button>
        <div ref={ref} className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth">
          {items.map(p => (
            <Link key={p.id} href={`/dp/${p.id}`} className="w-32 shrink-0 snap-start sm:w-48">
              <div className="flex h-32 items-center justify-center rounded bg-[#f7f7f7] p-2 sm:h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbnail} alt={p.title} loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply" />
              </div>
              {showPrice && (
                <div className="mt-2">
                  {p.discountPercentage >= 5 && (
                    <span className="mr-2 rounded-sm bg-deal px-1.5 py-0.5 text-xs font-bold text-white">{Math.round(p.discountPercentage)}% off</span>
                  )}
                  <span className="text-xs font-bold text-deal">Deal</span>
                  <p className="mt-1 text-sm">${p.price.toFixed(2)}</p>
                  <p className="line-clamp-1 text-sm text-muted">{p.title}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
        <button aria-label="Scroll right" onClick={() => scroll(1)} className="absolute top-1/2 right-0 z-10 hidden h-24 w-11 -translate-y-1/2 items-center justify-center rounded-l-md border border-line bg-white/95 text-2xl shadow group-hover:flex">
          ›
        </button>
      </div>
    </section>
  );
}
