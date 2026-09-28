import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { AddedToCartToast } from '@/components/cart/AddedToCartToast';
import { WishlistProvider } from '@/components/wishlist/WishlistProvider';
import { RevealRoot } from '@/components/motion/RevealRoot';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: { default: 'Shopora: Online Shopping for Electronics, Fashion, Home & more', template: '%s | Shopora' },
  description: 'Shop deals on electronics, fashion, beauty, home and more. Fast delivery and easy returns.',
};

export const viewport: Viewport = { themeColor: '#0b1220' };

/*
 * Runs before first paint so revealable content is hidden from the start and can fade in,
 * instead of painting visible and then being hidden (which cancels the entrance).
 * Safety net: if the app never boots, drop the class so nothing stays hidden.
 */
const REVEAL_BOOT = `(function(){if(!('IntersectionObserver' in window))return;var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!window.__revealReady)d.classList.remove('js-reveal')},3000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <WishlistProvider>
            {children}
            <AddedToCartToast />
            <RevealRoot />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
