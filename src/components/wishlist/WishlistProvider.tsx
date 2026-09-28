'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartProduct } from '@/lib/types';

export type WishItem = CartProduct & { discountPercentage: number; rating: number };

type WishState = {
  items: WishItem[];
  ready: boolean;
  has: (id: number) => boolean;
  toggle: (p: WishItem) => void;
  remove: (id: number) => void;
};

const Ctx = createContext<WishState | null>(null);
const KEY = 'shopora_wishlist_v1';

function load(): WishItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setItems(load());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage blocked */
    }
  }, [items, ready]);

  const ids = useMemo(() => new Set(items.map(i => i.id)), [items]);
  const has = useCallback((id: number) => ids.has(id), [ids]);
  const toggle = useCallback(
    (p: WishItem) => setItems(cur => (cur.some(i => i.id === p.id) ? cur.filter(i => i.id !== p.id) : [p, ...cur])),
    [],
  );
  const remove = useCallback((id: number) => setItems(cur => cur.filter(i => i.id !== id)), []);

  const value = useMemo(() => ({ items, ready, has, toggle, remove }), [items, ready, has, toggle, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return v;
}
