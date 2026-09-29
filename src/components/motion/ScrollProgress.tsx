'use client';

import { useEffect, useRef } from 'react';

/** Thin gradient bar at the very top of the viewport that fills as the page is scrolled. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--progress', String(max > 0 ? Math.min(window.scrollY / max, 1) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={ref} aria-hidden className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-[#7c5cff] via-[#b24dff] to-coral" />;
}
