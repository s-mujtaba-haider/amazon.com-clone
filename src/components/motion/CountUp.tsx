'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `value` once, when it first scrolls into view. Renders the final value without JS. */
export function CountUp({ value, decimals = 0, suffix = '', duration = 1400 }: { value: number; decimals?: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    setShown(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setShown(value * (1 - Math.pow(1 - t, 3)));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={`${value.toFixed(decimals)}${suffix}`} className="tabular-nums">
      <span aria-hidden>
        {shown.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
