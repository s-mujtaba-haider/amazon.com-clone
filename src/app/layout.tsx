import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { AddedToCartToast } from '@/components/cart/AddedToCartToast';
import { WishlistProvider } from '@/components/wishlist/WishlistProvider';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: { default: 'Shopora: Online Shopping for Electronics, Fashion, Home & more', template: '%s | Shopora' },
  description: 'Shop deals on electronics, fashion, beauty, home and more. Fast delivery and easy returns.',
};

export const viewport: Viewport = { themeColor: '#0b1220' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <WishlistProvider>
            {children}
            <AddedToCartToast />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
