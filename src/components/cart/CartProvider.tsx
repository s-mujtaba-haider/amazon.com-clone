'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, CartProduct } from '@/lib/types';

type CartState = {
  items: CartItem[];
  saved: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  lastAdded: CartItem | null;
  add: (p: CartProduct, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  saveForLater: (id: number) => void;
  moveToCart: (id: number) => void;
  removeSaved: (id: number) => void;
  clear: () => void;
  dismissAdded: () => void;
};

const Ctx = createContext<CartState | null>(null);
const KEY = 'shopora_cart_v1';
export const MAX_QTY = 10;

function load(): { items: CartItem[]; saved: CartItem[] } {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '');
    return { items: v.items ?? [], saved: v.saved ?? [] };
  } catch {
    return { items: [], saved: [] };
  }
}

const limit = (p: CartProduct) => Math.max(1, Math.min(MAX_QTY, p.stock));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  useEffect(() => {
    const v = load();
    setItems(v.items);
    setSaved(v.saved);
    setReady(true);
    // keep tabs in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      const n = load();
      setItems(n.items);
      setSaved(n.saved);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, saved }));
    } catch {
      /* storage blocked: cart still works for this tab */
    }
  }, [items, saved, ready]);

  const add = useCallback((p: CartProduct, qty = 1) => {
    const snapshot: CartProduct = { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand };
    setItems(cur => {
      const existing = cur.find(i => i.id === p.id);
      return existing
        ? cur.map(i => (i.id === p.id ? { ...i, qty: Math.min(limit(p), i.qty + qty) } : i))
        : [...cur, { ...snapshot, qty: Math.min(limit(p), qty) }];
    });
    setLastAdded({ ...snapshot, qty });
    setSaved(cur => cur.filter(i => i.id !== p.id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems(cur =>
      qty <= 0 ? cur.filter(i => i.id !== id) : cur.map(i => (i.id === id ? { ...i, qty: Math.min(limit(i), qty) } : i)),
    );
  }, []);

  const remove = useCallback((id: number) => setItems(cur => cur.filter(i => i.id !== id)), []);

  const saveForLater = useCallback(
    (id: number) => {
      const it = items.find(i => i.id === id);
      if (!it) return;
      setItems(cur => cur.filter(i => i.id !== id));
      setSaved(s => [it, ...s.filter(x => x.id !== id)]);
    },
    [items],
  );

  const moveToCart = useCallback(
    (id: number) => {
      const it = saved.find(i => i.id === id);
      if (!it) return;
      setSaved(cur => cur.filter(i => i.id !== id));
      setItems(s => (s.some(x => x.id === id) ? s : [...s, it]));
    },
    [saved],
  );

  const removeSaved = useCallback((id: number) => setSaved(cur => cur.filter(i => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const dismissAdded = useCallback(() => setLastAdded(null), []);

  const value = useMemo<CartState>(
    () => ({
      items,
      saved,
      ready,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
      lastAdded,
      add,
      setQty,
      remove,
      saveForLater,
      moveToCart,
      removeSaved,
      clear,
      dismissAdded,
    }),
    [items, saved, ready, lastAdded, add, setQty, remove, saveForLater, moveToCart, removeSaved, clear, dismissAdded],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used inside <CartProvider>');
  return v;
}
