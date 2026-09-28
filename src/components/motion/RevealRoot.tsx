'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Turns on scroll-reveal for any element marked `data-reveal`. Content is visible by default
 * (no JS, reduced motion, or old browsers); only once this runs does it start hidden and fade up
 * as it enters the viewport.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('js-reveal');

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const scan = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach(el => {
        // anything already on screen shows immediately, without a flash
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
        else io.observe(el);
      });
    scan();
    // pick up client-rendered content (cart, wishlist) that mounts after the first pass
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
