'use server';

import { randomInt } from 'node:crypto';
import { StorageNotConfiguredError, createOrder } from '@/lib/db';
import { FREE_SHIPPING_MIN, deliveryDate } from '@/lib/format';
import { getProduct } from '@/lib/products';
import { currentUser } from '@/lib/session';
import type { Address, OrderItem } from '@/lib/types';

export type PlaceOrderResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof Address, string>> };

const REQUIRED: (keyof Address)[] = ['fullName', 'phone', 'line1', 'city', 'state', 'zip', 'country'];

export async function placeOrder(input: {
  items: { id: number; qty: number }[];
  address: Address;
  payment: string;
}): Promise<PlaceOrderResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: 'Your session expired. Please sign in again.' };

  const fieldErrors: Partial<Record<keyof Address, string>> = {};
  for (const k of REQUIRED) if (!input.address[k]?.trim()) fieldErrors[k] = 'Required';
  if (input.address.phone && !/^[\d\s+()-]{7,}$/.test(input.address.phone)) fieldErrors.phone = 'Enter a valid phone number';
  if (Object.keys(fieldErrors).length) return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors };
  if (!['card', 'cod', 'gift'].includes(input.payment)) return { ok: false, error: 'Choose a payment method.' };

  // Never trust client prices: rebuild every line from the catalog.
  const items: OrderItem[] = [];
  for (const { id, qty } of input.items) {
    const p = getProduct(id);
    if (!p) return { ok: false, error: 'An item in your cart is no longer available.' };
    const q = Math.floor(qty);
    if (q < 1 || q > Math.min(p.stock, 10)) return { ok: false, error: `Quantity for "${p.title}" is not available.` };
    items.push({ id: p.id, title: p.title, price: p.price, qty: q, thumbnail: p.thumbnail });
  }
  if (!items.length) return { ok: false, error: 'Your cart is empty.' };

  const round = (n: number) => Math.round(n * 100) / 100;
  const subtotal = round(items.reduce((s, i) => s + i.price * i.qty, 0));
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : 5.99;
  const tax = round(subtotal * 0.08);
  const id = `${randomInt(100, 999)}-${randomInt(1000000, 9999999)}-${randomInt(1000000, 9999999)}`;

  try {
    await createOrder({
      id,
      userId: user.id,
      items,
      subtotal,
      shipping,
      tax,
      total: round(subtotal + shipping + tax),
      address: input.address,
      payment: input.payment,
      createdAt: new Date().toISOString(),
      deliverBy: deliveryDate(3),
    });
  } catch (e) {
    console.error('[orders] storage error', e);
    return {
      ok: false,
      error: e instanceof StorageNotConfiguredError ? 'Orders are temporarily unavailable: storage is not set up on this deployment.' : 'We could not save your order. Please try again.',
    };
  }
  return { ok: true, id };
}
