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
      <header className="bg-ink text-white">
        <div className="gutter flex max-w-[1280px] items-center justify-between py-3.5">
          <Link href="/" className="text-2xl" aria-label="Kyro home">
            <Logo />
          </Link>
          <h1 className="text-lg font-bold sm:text-xl">Checkout</h1>
          <span className="flex items-center gap-1.5 text-sm text-white/70">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-mint">
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
