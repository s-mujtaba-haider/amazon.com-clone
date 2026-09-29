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
  const o = await getOrder(user.id, id);
  if (!o) notFound();

  const a = o.address;
  return (
    <div className="gutter max-w-[1280px] py-6 sm:py-8">
      {placed && (
        <div role="status" className="mb-6 flex animate-[bounce-in_.6s_both] gap-4 rounded-3xl bg-gradient-to-br from-mint-50 to-white p-6 ring-1 ring-success/20">
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

      <nav aria-label="Breadcrumb" className="breadcrumb mb-2">
        <Link href="/">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/orders">Your orders</Link>
        <span aria-hidden>›</span>
        <span className="font-semibold text-ink">Order details</span>
      </nav>
      <h1 className="page-title">Order details</h1>
      <p className="mt-1 mb-5 text-sm text-muted">
        Ordered on {new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} <span className="mx-2 text-line">|</span> Order# {o.id}
      </p>

      <div data-reveal className="grid gap-6 rounded-3xl bg-white p-6 text-sm shadow-[var(--shadow-soft)] sm:grid-cols-3">
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
        <div>
          <h2 className="mb-1 font-bold">Order Summary</h2>
          <dl className="space-y-1">
          <div className="flex justify-between"><dt>Item(s) Subtotal:</dt><dd>{money(o.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping &amp; Handling:</dt><dd>{o.shipping ? money(o.shipping) : 'FREE'}</dd></div>
          <div className="flex justify-between"><dt>Estimated tax:</dt><dd>{money(o.tax)}</dd></div>
          <div className="flex justify-between border-t border-line pt-1 font-bold"><dt>Grand Total:</dt><dd>{money(o.total)}</dd></div>
          </dl>
        </div>
      </div>

      <div data-reveal className="mt-5 rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-lg font-bold">Arriving {o.deliverBy}</p>
        <ol className="my-4 flex text-xs" aria-label="Shipment progress">
          {['Ordered', 'Shipped', 'Out for delivery', 'Delivered'].map((s, i) => (
            <li key={s} className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e6e8f0]">{i === 0 && <div className="h-full origin-left animate-[fill-x_.9s_.3s_cubic-bezier(.2,.8,.2,1)_both] bg-success" />}</div>
              <p className={`mt-1 ${i === 0 ? 'font-bold text-success' : 'text-muted'}`}>{s}</p>
            </li>
          ))}
        </ol>
        <ul className="space-y-4">
          {o.items.map(i => (
            <li key={i.id} className="flex gap-4 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-2xl bg-[#f3f4f8] object-contain p-1.5 mix-blend-multiply" />
              <div>
                <Link href={`/dp/${i.id}`} className="font-semibold hover:text-brand">
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
