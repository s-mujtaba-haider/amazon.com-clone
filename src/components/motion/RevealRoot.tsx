'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const FROM: Record<string, string> = {
  '': 'translateY(40px) scale(0.97)',
  left: 'translateX(-48px)',
  right: 'translateX(48px)',
  zoom: 'scale(0.86)',
};

/**
 * Scroll-reveal for any element marked `data-reveal` ("", "left", "right" or "zoom").
 * A boot script in the root layout adds `js-reveal` to <html> before first paint, so marked
 * content starts hidden (opacity 0, see globals.css); this component fades it in: the first
 * screen cascades in right away, the rest as it scrolls into view.
 *
 * The entrance is played with the Web Animations API (`fill: both`) instead of toggling a class
 * or inline style. That matters: this runs before React has hydrated the page segment (always
 * true in `next dev`), and any attribute written onto server-rendered markup makes hydration
 * report a mismatch. Animations change no attributes, so there is nothing to mismatch.
 * `--reveal-delay` set by the component is honoured; under reduced motion it is a plain fade.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !('animate' in Element.prototype)) {
      document.documentElement.classList.remove('js-reveal');
      return;
    }
    window.__revealReady = true;
    // If the boot script's safety net already un-hid everything (app booted late), leave it.
    if (!document.documentElement.classList.contains('js-reveal')) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const show = (el: HTMLElement, fallbackDelay = 0) => {
      const own = parseFloat(el.style.getPropertyValue('--reveal-delay'));
      const delay = Number.isNaN(own) ? fallbackDelay : own;
      const from = FROM[el.dataset.reveal ?? ''] ?? FROM[''];
      el.animate(
        still ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }],
        { duration: still ? 700 : 800, delay, easing: EASE, fill: 'both' },
      );
      // grow the accent bar of section titles that belong to this element (not to a nested reveal)
      el.querySelectorAll<HTMLElement>('.title-bar').forEach(t => {
        if (t.closest('[data-reveal]') !== el) return;
        t.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 700, delay: delay + 200, easing: EASE, fill: 'both', pseudoElement: '::before' });
      });
    };

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
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
        if (r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0) {
          // first screen: cascade in, unless the element set its own delay
          show(el, Math.min(onScreen, 8) * 70);
          onScreen++;
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
