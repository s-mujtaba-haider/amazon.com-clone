import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrder } from '@/lib/db';
import { money } from '@/lib/format';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Order details' };

const PAYMENT_LABEL: Record<string, string> = { card: 'Card (demo)', gift: 'Gift card balance (demo)', cod: 'Cash on delivery' };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ placed?: string }> }) {
  const [{ id }, { placed }] = await Promise.all([params, searchParams]);
  const user = await currentUser();
  if (!user) redirect(`/signin?next=/orders/${id}`);
  const o = getOrder(user.id, id);
  if (!o) notFound();

  const a = o.address;
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      {placed && (
        <div role="status" className="mb-6 flex gap-3 rounded-lg border border-success p-4 shadow-[0_0_0_4px_#e6f4f1_inset]">
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-success">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z" />
          </svg>
          <div>
            <p className="text-lg font-bold text-success">Order placed, thank you!</p>
            <p className="text-sm">
              Confirmation will be sent to <b>{user.email}</b>. Arriving <b>{o.deliverBy}</b>.
            </p>
            <Link href="/" className="link mt-1 inline-block text-sm">
              Continue shopping ›
            </Link>
          </div>
        </div>
      )}

      <nav className="mb-2 text-sm text-muted">
        <Link href="/orders" className="link">Your Orders</Link> › <span className="text-link-hover">Order details</span>
      </nav>
      <h1 className="text-[28px]">Order details</h1>
      <p className="mb-4 text-sm">
        Ordered on {new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} <span className="mx-2 text-line">|</span> Order# {o.id}
      </p>

      <div className="grid gap-6 rounded-lg border border-line p-4 text-sm sm:grid-cols-3">
        <div>
          <h2 className="mb-1 font-bold">Shipping Address</h2>
          <p>{a.fullName}</p>
          <p>{a.line1}</p>
          {a.line2 && <p>{a.line2}</p>}
          <p>
            {a.city}, {a.state} {a.zip}
          </p>
          <p>{a.country}</p>
        </div>
        <div>
          <h2 className="mb-1 font-bold">Payment Method</h2>
          <p>{PAYMENT_LABEL[o.payment] ?? o.payment}</p>
        </div>
        <dl className="space-y-1">
          <h2 className="mb-1 font-bold">Order Summary</h2>
          <div className="flex justify-between"><dt>Item(s) Subtotal:</dt><dd>{money(o.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping &amp; Handling:</dt><dd>{o.shipping ? money(o.shipping) : 'FREE'}</dd></div>
          <div className="flex justify-between"><dt>Estimated tax:</dt><dd>{money(o.tax)}</dd></div>
          <div className="flex justify-between font-bold"><dt>Grand Total:</dt><dd>{money(o.total)}</dd></div>
        </dl>
      </div>

      <div className="mt-5 rounded-lg border border-line p-4">
        <p className="text-lg font-bold">Arriving {o.deliverBy}</p>
        <ol className="my-4 flex text-xs" aria-label="Shipment progress">
          {['Ordered', 'Shipped', 'Out for delivery', 'Delivered'].map((s, i) => (
            <li key={s} className="flex-1">
              <div className={`h-1.5 ${i === 0 ? 'bg-success' : 'bg-[#e3e6e6]'}`} />
              <p className={`mt-1 ${i === 0 ? 'font-bold text-success' : 'text-muted'}`}>{s}</p>
            </li>
          ))}
        </ol>
        <ul className="space-y-4">
          {o.items.map(i => (
            <li key={i.id} className="flex gap-4 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.thumbnail} alt="" className="h-20 w-20 object-contain" />
              <div>
                <Link href={`/dp/${i.id}`} className="link">
                  {i.title}
                </Link>
                <p className="text-muted">Qty: {i.qty}</p>
                <p className="text-deal">{money(i.price)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
