'use client';

import { useState } from 'react';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col-reverse gap-3 lg:sticky lg:top-32 lg:flex-row lg:self-start">
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
                className={`flex h-14 w-14 items-center justify-center rounded-md border p-1 ${i === active ? 'border-[#e77600] shadow-[0_0_3px_2px_rgba(228,121,17,.5)]' : 'border-[#bbb]'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        className="relative flex aspect-square flex-1 cursor-zoom-in items-center justify-center overflow-hidden"
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          className="max-h-full max-w-full object-contain transition-transform duration-100"
          style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
    </div>
  );
}
