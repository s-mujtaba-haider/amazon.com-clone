import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Stars } from './Stars';
import { Price } from './Price';
import { AddToCartButton } from './AddToCartButton';

export function ProductCard({ p, deliveryLabel }: { p: Product; deliveryLabel: string }) {
  const isDeal = p.discountPercentage >= 10;
  return (
    <article className="group flex flex-col rounded-md border border-[#e7e7e7] bg-white">
      <Link href={`/dp/${p.id}`} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-t-md bg-[#f7f7f7] p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
        {isDeal && <span className="absolute top-2 left-2 rounded-sm bg-deal px-1.5 py-0.5 text-xs font-bold text-white">-{Math.round(p.discountPercentage)}%</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {p.brand && <span className="text-xs text-muted">{p.brand}</span>}
        <Link href={`/dp/${p.id}`} className="line-clamp-2 text-[15px] leading-snug hover:text-link-hover">
          {p.title}
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-muted">{p.rating.toFixed(1)}</span>
          <Stars rating={p.rating} size={14} />
          <span className="text-link">({p.reviews.length})</span>
        </div>
        {isDeal && <span className="w-fit rounded-sm bg-deal px-1.5 py-0.5 text-xs font-bold text-white">Limited time deal</span>}
        <Price price={p.price} discount={p.discountPercentage} size="sm" />
        <p className="text-xs">
          <span className="font-bold text-accent-strong">✓ shoprapid</span> FREE delivery <b>{deliveryLabel}</b>
        </p>
        {p.stock > 0 && p.stock <= 10 && <p className="text-xs text-deal">Only {p.stock} left in stock - order soon.</p>}
        <div className="mt-auto pt-2">
          <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock, brand: p.brand }} compact />
        </div>
      </div>
    </article>
  );
}
