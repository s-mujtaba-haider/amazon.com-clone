import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { AddedToCartToast } from '@/components/cart/AddedToCartToast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Shopora: Online Shopping for Electronics, Fashion, Home & more', template: '%s | Shopora' },
  description: 'Shop deals on electronics, fashion, beauty, home and more. Fast delivery and easy returns.',
};

export const viewport: Viewport = { themeColor: '#131921' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          {children}
          <AddedToCartToast />
        </CartProvider>
      </body>
    </html>
  );
}
