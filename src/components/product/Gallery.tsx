'use client';

import { useState } from 'react';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:sticky md:top-32 md:self-start lg:sticky lg:top-32 lg:flex-row lg:self-start">
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col" aria-label="Product images">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`flex h-16 w-16 items-center justify-center rounded-xl bg-white p-1.5 shadow-[var(--shadow-soft)] transition ${i === active ? 'ring-2 ring-brand' : 'ring-1 ring-line hover:ring-brand/40'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        className="relative flex aspect-square max-h-[min(90vw,620px)] flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#eef0f7] p-6 shadow-[var(--shadow-soft)]"
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={images[active]}
          alt={title}
          className="max-h-full max-w-full animate-[fade-in_.35s_ease-out] object-contain mix-blend-multiply transition-transform duration-100"
          style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
    </div>
  );
}
