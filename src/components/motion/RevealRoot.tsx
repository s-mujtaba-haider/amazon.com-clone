'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/**
 * Scroll-reveal for any element marked `data-reveal`. A boot script in the root layout adds
 * `js-reveal` before first paint, so marked content starts hidden; this component then fades it in:
 * whatever is on the first screen cascades in right away, the rest as it scrolls into view.
 * Without JS (or IntersectionObserver) nothing is hidden. Under reduced motion the reveal is a
 * plain fade (see globals.css).
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    window.__revealReady = true;
    // If the boot script's safety net already un-hid everything (app booted late), don't hide it again.
    if (!document.documentElement.classList.contains('js-reveal')) return;

    // The hidden state must be computed before `is-visible` lands, or the browser collapses both
    // into one style pass and no transition plays. Reading layout forces that computation
    // synchronously (requestAnimationFrame would stall in background tabs, leaving content hidden).
    const show = (el: Element) => {
      void (el as HTMLElement).offsetWidth;
      el.classList.add('is-visible');
    };

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      let onScreen = 0;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          // first screen: cascade in, unless the element set its own delay
          if (!el.style.getPropertyValue('--reveal-delay')) el.style.setProperty('--reveal-delay', `${Math.min(onScreen, 8) * 70}ms`);
          onScreen++;
          show(el);
        } else io.observe(el);
      });
    };
    scan();
    // pick up content that mounts later (cart, wishlist, client navigations)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
