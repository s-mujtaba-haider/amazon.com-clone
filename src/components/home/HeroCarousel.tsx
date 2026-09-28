'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Slide = { eyebrow: string; title: string; subtitle: string; cta: string; href: string; bg: string; images: string[] };

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => setI(x => (x + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="group relative h-[250px] overflow-hidden rounded-3xl sm:h-[340px] xl:h-[420px] 2xl:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={e => {
        const start = touchX.current;
        touchX.current = null;
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      {slides.map((s, idx) => (
        <div
          key={s.title}
          aria-hidden={idx !== i}
          className={`absolute inset-0 transition-all duration-700 ${idx === i ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.02] opacity-0'}`}
          style={{ background: s.bg }}
        >
          {/* soft decorative blobs */}
          <span aria-hidden className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <span aria-hidden className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex h-full items-center justify-between gap-4 px-6 sm:px-12 xl:px-16">
            <div className="max-w-[58%] text-white sm:max-w-lg">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur sm:text-xs">{s.eyebrow}</span>
              <h2 className="mt-2 text-2xl leading-[1.1] font-extrabold tracking-tight sm:mt-3 sm:text-4xl xl:text-5xl 2xl:text-6xl">{s.title}</h2>
              <p className="mt-2 text-[13px] text-white/85 sm:mt-3 sm:text-lg">{s.subtitle}</p>
              <Link
                href={s.href}
                tabIndex={idx === i ? 0 : -1}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-ink shadow-lg transition hover:gap-3 sm:mt-6 sm:px-6 sm:py-3 sm:text-base"
              >
                {s.cta} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="relative flex shrink-0 items-center">
              {s.images.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`rounded-3xl bg-white/95 object-contain p-3 shadow-2xl ${
                    k === 0 ? 'relative z-10 h-28 w-28 sm:h-48 sm:w-48 xl:h-64 xl:w-64' : k === 1 ? 'ml-[-2rem] hidden h-40 w-40 rotate-6 sm:block xl:h-52 xl:w-52' : 'ml-[-1.5rem] hidden h-44 w-44 -rotate-3 2xl:block'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2 sm:right-6 sm:bottom-6">
        <button aria-label="Previous slide" onClick={() => go(-1)} className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white backdrop-blur transition hover:bg-white/35 sm:flex">
          ‹
        </button>
        <div className="flex gap-1.5 rounded-full bg-black/15 px-2.5 py-2 backdrop-blur">
          {slides.map((s, idx) => (
            <button
              key={s.title}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
        <button aria-label="Next slide" onClick={() => go(1)} className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white backdrop-blur transition hover:bg-white/35 sm:flex">
          ›
        </button>
      </div>
    </section>
  );
}
