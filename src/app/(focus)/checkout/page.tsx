import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Checkout } from '@/components/checkout/Checkout';
import { Logo } from '@/components/layout/Logo';
import { deliveryDate } from '@/lib/format';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) redirect('/signin?next=/checkout');

  return (
    <>
      <header className="border-b border-line bg-gradient-to-b from-white to-[#f3f3f3]">
        <div className="mx-auto flex max-w-[1150px] items-center justify-between px-4 py-3">
          <Link href="/" className="text-2xl">
            <Logo dark />
          </Link>
          <h1 className="text-xl font-normal sm:text-2xl">Checkout</h1>
          <span className="flex items-center gap-1 text-sm text-muted">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-muted">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
            </svg>
            <span className="hidden sm:inline">Secure checkout</span>
          </span>
        </div>
      </header>
      <Checkout userName={user.name} deliverBy={deliveryDate(3)} />
    </>
  );
}
