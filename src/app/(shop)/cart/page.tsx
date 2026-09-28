import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Shopping Cart' };

export default async function CartPage() {
  const user = await currentUser();
  return (
    <div className="bg-page">
      <CartView signedIn={!!user} />
    </div>
  );
}
