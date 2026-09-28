'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export type Slide = { title: string; subtitle: string; cta: string; href: string; bg: string; images: string[] };

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setI(x => (x + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div
          key={s.title}
          aria-hidden={idx !== i}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ background: s.bg }}
        >
          <div className="mx-auto flex h-full max-w-[1500px] items-start justify-between gap-6 px-6 pt-6 sm:px-14 sm:pt-10">
            <div className="max-w-md text-white">
              <h2 className="text-2xl leading-tight font-extrabold drop-shadow sm:text-4xl lg:text-5xl">{s.title}</h2>
              <p className="mt-2 text-sm opacity-90 sm:text-lg">{s.subtitle}</p>
              <Link href={s.href} tabIndex={idx === i ? 0 : -1} className="btn-cta mt-4 px-6 py-2 text-base font-semibold">
                {s.cta}
              </Link>
            </div>
            <div className="hidden gap-3 sm:flex">
              {s.images.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`h-40 w-40 rounded-xl bg-white/90 object-contain p-3 shadow-xl lg:h-56 lg:w-56 ${k === 1 ? 'mt-10' : ''} ${k === 2 ? 'hidden lg:block' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <button aria-label="Previous slide" onClick={() => go(-1)} className="absolute top-0 left-0 z-10 flex h-[60%] w-12 items-center justify-center text-5xl text-white/80 hover:text-white focus-visible:text-white sm:w-20">
        ‹
      </button>
      <button aria-label="Next slide" onClick={() => go(1)} className="absolute top-0 right-0 z-10 flex h-[60%] w-12 items-center justify-center text-5xl text-white/80 hover:text-white focus-visible:text-white sm:w-20">
        ›
      </button>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-page" />
    </section>
  );
}
