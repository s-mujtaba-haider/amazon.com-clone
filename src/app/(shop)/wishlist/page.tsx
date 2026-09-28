import type { Metadata } from 'next';
import { WishlistView } from '@/components/wishlist/WishlistView';

export const metadata: Metadata = { title: 'Your Wishlist' };

export default function WishlistPage() {
  return <WishlistView />;
}
