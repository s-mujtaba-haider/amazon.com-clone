'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { placeOrder } from '@/app/actions/orders';
import { useCart } from '@/components/cart/CartProvider';
import { FieldError, FormAlert } from '@/components/auth/FormBits';
import { FREE_SHIPPING_MIN, money } from '@/lib/format';
import type { Address } from '@/lib/types';

const PAYMENTS = [
  { id: 'card', label: 'Credit or debit card (demo)', note: 'Simulated. No card details are collected.' },
  { id: 'gift', label: 'Kyro gift card balance (demo)', note: 'Simulated balance covers this order.' },
  { id: 'cod', label: 'Cash on delivery', note: 'Pay when your order arrives.' },
];

const ADDRESS_KEY = 'shopora_address_v1';

function loadAddress(name: string): Address {
  try {
    const v = JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? '');
    if (v && typeof v === 'object') return v;
  } catch {}
  return { fullName: name, phone: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States' };
}

export function Checkout({ userName, deliverBy }: { userName: string; deliverBy: string }) {
  const { items, ready, subtotal, count, clear } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState<Address | null>(null);
  const [payment, setPayment] = useState('card');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [pending, start] = useTransition();

  if (ready && address === null) setAddress(loadAddress(userName));
  if (!ready || !address)
    return (
      <div className="gutter flex max-w-[1280px] flex-col gap-6 py-6 lg:flex-row" aria-busy="true">
        <div className="flex-1 space-y-4">
          <div className="skeleton h-72 rounded-3xl" />
          <div className="skeleton h-48 rounded-3xl" />
        </div>
        <div className="skeleton h-64 rounded-3xl lg:w-[340px]" />
      </div>
    );

  if (items.length === 0) {
    return (
      <div className="gutter py-10">
        <div className="empty-state">
          <span aria-hidden className="empty-icon">🛒</span>
          <p className="mt-5 text-lg font-bold">Your cart is empty.</p>
          <p className="mt-1 text-sm text-muted">Add something to your cart to check out.</p>
          <Link href="/" className="btn-cta mt-6 px-6 py-3">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [k]: e.target.value });
    if (fieldErrors[k]) setFieldErrors({ ...fieldErrors, [k]: undefined });
  };

  const submit = () =>
    start(async () => {
      setError(null);
      const res = await placeOrder({ items: items.map(i => ({ id: i.id, qty: i.qty })), address, payment });
      if (!res.ok) {
        setError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      try {
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
      } catch {}
      clear();
      router.push(`/orders/${res.id}?placed=1`);
    });

  const input = (k: keyof Address, label: string, opts: { autoComplete?: string; optional?: boolean; className?: string; inputMode?: 'tel' | 'numeric' } = {}) => (
    <div className={opts.className}>
      <label htmlFor={k} className="text-sm font-semibold">
        {label} {opts.optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={k}
        value={address[k]}
        onChange={set(k)}
        autoComplete={opts.autoComplete}
        inputMode={opts.inputMode}
        aria-invalid={!!fieldErrors[k]}
        className={`field mt-1 ${fieldErrors[k] ? 'field-error' : ''}`}
      />
      <FieldError msg={fieldErrors[k]} />
    </div>
  );

  const PlaceButton = ({ className = '' }: { className?: string }) => (
    <button onClick={submit} disabled={pending} className={`btn-cta py-3 text-base ${className}`}>
      {pending ? 'Placing your order…' : 'Place your order'}
    </button>
  );

  return (
    <div className="gutter flex max-w-[1280px] flex-col gap-6 py-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-4">
        {error && <FormAlert title="We couldn't place your order">{error}</FormAlert>}

        <section data-reveal className="rounded-3xl bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="mb-4 flex items-center text-lg font-extrabold">
            <span className="mr-2.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#b24dff] text-sm text-white shadow-[0_4px_12px_-4px_rgba(91,61,245,.7)]">1</span>Delivery address
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('fullName', 'Full name', { autoComplete: 'name' })}
            {input('phone', 'Phone number', { autoComplete: 'tel', inputMode: 'tel' })}
            {input('line1', 'Address', { autoComplete: 'address-line1', className: 'sm:col-span-2' })}
            {input('line2', 'Apt, suite, unit', { autoComplete: 'address-line2', optional: true, className: 'sm:col-span-2' })}
            {input('city', 'City', { autoComplete: 'address-level2' })}
            {input('state', 'State', { autoComplete: 'address-level1' })}
            {input('zip', 'ZIP code', { autoComplete: 'postal-code', inputMode: 'numeric' })}
            {input('country', 'Country', { autoComplete: 'country-name' })}
          </div>
        </section>

        <section data-reveal className="rounded-3xl bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="mb-4 flex items-center text-lg font-extrabold">
            <span className="mr-2.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#b24dff] text-sm text-white shadow-[0_4px_12px_-4px_rgba(91,61,245,.7)]">2</span>Payment method
          </h2>
          <fieldset className="space-y-2">
            <legend className="sr-only">Payment method</legend>
            {PAYMENTS.map(p => (
              <label key={p.id} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${payment === p.id ? 'border-brand bg-brand-50' : 'border-line hover:border-brand/40'}`}>
                <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-0.5" />
                <span>
                  <b className="text-sm">{p.label}</b>
                  <span className="block text-xs text-muted">{p.note}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </section>

        <section data-reveal className="rounded-3xl bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="mb-1 flex items-center text-lg font-extrabold">
            <span className="mr-2.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#b24dff] text-sm text-white shadow-[0_4px_12px_-4px_rgba(91,61,245,.7)]">3</span>Review items and delivery
          </h2>
          <p className="mb-3 font-bold text-success">Arriving {deliverBy}</p>
          <ul className="divide-y divide-line">
            {items.map(i => (
              <li key={i.id} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-[#f3f4f8] object-contain p-1 mix-blend-multiply" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-2 font-bold">{i.title}</p>
                  <p className="text-muted">
                    Qty {i.qty} · <b className="text-ink">{money(i.price)}</b>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-[#fafbfe] p-4 sm:flex-row">
            <PlaceButton className="w-full sm:w-auto sm:px-6" />
            <div>
              <p className="text-lg font-extrabold text-ink">Order total: {money(total)}</p>
              <p className="text-xs text-muted">By placing your order, you agree to Kyro&apos;s conditions of use (demo).</p>
            </div>
          </div>
        </section>
      </div>

      <aside data-reveal="right" className="w-full rounded-3xl bg-white p-5 shadow-[var(--shadow-lift)] lg:sticky lg:top-6 lg:w-[340px]">
        <PlaceButton className="w-full" />
        <hr className="my-3 border-line" />
        <h3 className="mb-2 text-lg font-extrabold">Order summary</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt>Items ({count}):</dt>
            <dd>{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping &amp; handling:</dt>
            <dd>{shipping === 0 ? <b className="text-success">FREE</b> : money(shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated tax (8%):</dt>
            <dd>{money(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold text-ink">
            <dt>Order total:</dt>
            <dd>{money(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
