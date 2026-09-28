import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ordersFor } from '@/lib/db';
import { money } from '@/lib/format';
import { currentUser } from '@/lib/session';
import { BuyAgainButton } from '@/components/orders/BuyAgainButton';
import { getProduct } from '@/lib/products';

export const metadata: Metadata = { title: 'Your Orders' };

export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect('/signin?next=/orders');
  const orders = await ordersFor(user.id);

  return (
    <div className="gutter max-w-[1280px] py-6 sm:py-8">
      <nav className="mb-2 text-sm text-muted">
        <Link href="/" className="link">Your Account</Link> › <span className="text-link-hover">Your Orders</span>
      </nav>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Your Orders</h1>
      <p className="mb-4 text-sm">
        <b>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</b> placed
      </p>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-[var(--shadow-soft)]">
          <p className="text-lg">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="btn-cta mt-4">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map(o => (
            <li key={o.id} className="overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-soft)]">
              <div className="grid grid-cols-2 gap-3 bg-[#f7f8fc] px-5 py-4 text-xs text-muted sm:grid-cols-[auto_auto_auto_1fr]">
                <div>
                  <p className="uppercase">Order placed</p>
                  <p className="text-sm text-[#0f1111]">{new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="sm:px-6">
                  <p className="uppercase">Total</p>
                  <p className="text-sm text-[#0f1111]">{money(o.total)}</p>
                </div>
                <div>
                  <p className="uppercase">Ship to</p>
                  <p className="text-sm text-link">{o.address.fullName}</p>
                </div>
                <div className="sm:text-right">
                  <p className="uppercase">Order # {o.id}</p>
                  <Link href={`/orders/${o.id}`} className="link text-sm">
                    View order details
                  </Link>
                </div>
              </div>
              <div className="p-5">
                <p className="text-lg font-bold">Arriving {o.deliverBy}</p>
                <ul className="mt-3 space-y-4">
                  {o.items.map(i => {
                    const p = getProduct(i.id);
                    return (
                      <li key={i.id} className="flex gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={i.thumbnail} alt="" className="h-20 w-20 rounded-2xl bg-[#f3f4f8] object-contain p-1.5 mix-blend-multiply" />
                        <div className="min-w-0 flex-1 text-sm">
                          <Link href={`/dp/${i.id}`} className="link line-clamp-2">
                            {i.title}
                          </Link>
                          <p className="text-muted">Qty {i.qty} · {money(i.price)}</p>
                          {p && (
                            <div className="mt-2">
                              <BuyAgainButton product={{ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand }} />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
