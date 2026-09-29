'use client';

import { useRef } from 'react';

/**
 * Wraps content in a card that tilts toward the pointer with a soft glare. Mouse/pen only:
 * touch devices keep the flat card so scrolling never jiggles it.
 */
export function TiltCard({ children, className = '', max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
    s.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
    s.setProperty('--gx', `${x * 100}%`);
    s.setProperty('--gy', `${y * 100}%`);
  };
  const reset = () => {
    const s = ref.current?.style;
    s?.setProperty('--rx', '0deg');
    s?.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={`tilt relative ${className}`}>
      {children}
      <span aria-hidden className="tilt-glare pointer-events-none absolute inset-0 z-20 rounded-[inherit]" />
    </div>
  );
}
