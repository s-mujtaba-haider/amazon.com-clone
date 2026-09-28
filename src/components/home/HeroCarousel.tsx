'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Slide = { title: string; subtitle: string; cta: string; href: string; bg: string; images: string[] };

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => setI(x => (x + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative h-[230px] overflow-hidden sm:h-[340px] lg:h-[420px]"
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
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ background: s.bg }}
        >
          <div className="mx-auto flex h-full max-w-[1500px] items-start justify-between gap-4 px-5 pt-5 sm:px-16 sm:pt-10">
            <div className="max-w-[60%] text-white sm:max-w-md">
              <h2 className="text-[22px] leading-tight font-extrabold drop-shadow sm:text-4xl lg:text-5xl">{s.title}</h2>
              <p className="mt-1.5 text-[13px] opacity-90 sm:mt-2 sm:text-lg">{s.subtitle}</p>
              <Link href={s.href} tabIndex={idx === i ? 0 : -1} className="btn-cta mt-3 px-5 py-1.5 text-sm font-semibold sm:mt-4 sm:px-6 sm:py-2 sm:text-base">
                {s.cta}
              </Link>
            </div>
            <div className="flex shrink-0 gap-3">
              {s.images.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`h-24 w-24 rounded-xl bg-white/90 object-contain p-2 shadow-xl sm:h-40 sm:w-40 sm:p-3 lg:h-56 lg:w-56 ${k === 1 ? 'hidden sm:mt-10 sm:block' : ''} ${k === 2 ? 'hidden lg:block' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <button aria-label="Previous slide" onClick={() => go(-1)} className="absolute top-0 left-0 z-10 hidden h-[60%] w-14 items-center justify-center text-5xl text-white/80 hover:text-white focus-visible:text-white sm:flex">
        ‹
      </button>
      <button aria-label="Next slide" onClick={() => go(1)} className="absolute top-0 right-0 z-10 hidden h-[60%] w-14 items-center justify-center text-5xl text-white/80 hover:text-white focus-visible:text-white sm:flex">
        ›
      </button>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-page sm:h-40" />
      <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2 sm:hidden">
        {slides.map((s, idx) => (
          <button key={s.title} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? 'w-5 bg-[#0f1111]' : 'w-2 bg-[#0f1111]/30'}`} />
        ))}
      </div>
    </section>
  );
}
