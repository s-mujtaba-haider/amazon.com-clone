import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Stars } from '@/components/product/Stars';
import { SortSelect } from '@/components/search/SortSelect';
import { deliveryDate } from '@/lib/format';
import { categoryLabel, search, type SortKey } from '@/lib/products';

type SP = Record<string, string | string[] | undefined>;
const PAGE_SIZE = 24;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = one(sp.q);
  const c = one(sp.category);
  return { title: q ? `Results for "${q}"` : c ? categoryLabel(c) : 'All products' };
}

const PRICE_BANDS: [string, number | undefined, number | undefined][] = [
  ['Under $25', undefined, 25],
  ['$25 to $50', 25, 50],
  ['$50 to $100', 50, 100],
  ['$100 to $500', 100, 500],
  ['$500 & above', 500, undefined],
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q) ?? '';
  const category = one(sp.category) || undefined;
  const brand = one(sp.brand) || undefined;
  const min = num(one(sp.min));
  const max = num(one(sp.max));
  const rating = num(one(sp.rating));
  const deals = one(sp.deals) === '1';
  const sort = (one(sp.sort) as SortKey) || 'featured';
  const page = Math.max(1, num(one(sp.page)) ?? 1);

  const { results, categories, brands } = search({ q, category, brand, min, max, rating, deals, sort });
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const deliveryLabel = deliveryDate(2);

  /** Builds a link that changes some params and resets paging. */
  const href = (patch: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    const base: Record<string, string | undefined> = { q: q || undefined, category, brand, min: min?.toString(), max: max?.toString(), rating: rating?.toString(), deals: deals ? '1' : undefined, sort: sort !== 'featured' ? sort : undefined };
    for (const [k, v] of Object.entries({ ...base, ...patch })) if (v !== undefined && v !== '') u.set(k, String(v));
    return `/s?${u.toString()}`;
  };

  const label = q ? `"${q}"` : category ? categoryLabel(category) : deals ? "Today's Deals" : 'all products';
  const activeFilters = [
    category && { text: categoryLabel(category), clear: href({ category: undefined, brand: undefined }) },
    brand && { text: brand, clear: href({ brand: undefined }) },
    (min !== undefined || max !== undefined) && { text: `$${min ?? 0}${max !== undefined ? ` – $${max}` : '+'}`, clear: href({ min: undefined, max: undefined }) },
    rating && { text: `${rating}★ & up`, clear: href({ rating: undefined }) },
    deals && { text: 'Deals', clear: href({ deals: undefined }) },
  ].filter(Boolean) as { text: string; clear: string }[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2 text-sm shadow-sm">
        <p>
          {results.length === 0 ? 'No' : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, results.length)} of`} {results.length > 0 && results.length} results for{' '}
          <span className="font-bold text-link-hover">{label}</span>
        </p>
        <SortSelect value={sort} />
      </div>

      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-4">
        <aside className="hidden w-60 shrink-0 space-y-5 text-sm md:block" aria-label="Filters">
          <FilterGroup title="Department">
            {category && (
              <Link href={href({ category: undefined, brand: undefined })} className="mb-1 block text-xs hover:text-link-hover">
                ‹ Any Department
              </Link>
            )}
            {categories.map(([c, n]) => (
              <Link key={c} href={href({ category: c, brand: undefined })} className={`block py-0.5 hover:text-link-hover ${c === category ? 'font-bold' : ''}`}>
                {categoryLabel(c)} <span className="text-muted">({n})</span>
              </Link>
            ))}
          </FilterGroup>

          <FilterGroup title="Customer Reviews">
            {[4, 3, 2].map(r => (
              <Link key={r} href={href({ rating: rating === r ? undefined : r })} className={`flex items-center gap-1 py-0.5 hover:text-link-hover ${rating === r ? 'font-bold' : ''}`}>
                <Stars rating={r} size={16} /> & Up
              </Link>
            ))}
          </FilterGroup>

          {brands.length > 0 && (
            <FilterGroup title="Brands">
              {brands.map(([b]) => (
                <Link key={b} href={href({ brand: brand === b ? undefined : b })} className="flex items-center gap-2 py-0.5 hover:text-link-hover">
                  <span aria-hidden className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${brand === b ? 'border-link bg-link text-[10px] text-white' : 'border-[#888]'}`}>
                    {brand === b && '✓'}
                  </span>
                  {b}
                </Link>
              ))}
            </FilterGroup>
          )}

          <FilterGroup title="Price">
            {PRICE_BANDS.map(([t, lo, hi]) => {
              const on = min === lo && max === hi;
              return (
                <Link key={t} href={on ? href({ min: undefined, max: undefined }) : href({ min: lo, max: hi })} className={`block py-0.5 hover:text-link-hover ${on ? 'font-bold' : ''}`}>
                  {t}
                </Link>
              );
            })}
            <form action="/s" className="mt-2 flex items-center gap-1">
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              {brand && <input type="hidden" name="brand" value={brand} />}
              <input name="min" inputMode="numeric" placeholder="$ Min" defaultValue={min} className="field w-16 py-1" aria-label="Minimum price" />
              <input name="max" inputMode="numeric" placeholder="$ Max" defaultValue={max} className="field w-16 py-1" aria-label="Maximum price" />
              <button className="btn-secondary px-3 py-1">Go</button>
            </form>
          </FilterGroup>

          <FilterGroup title="Deals & Discounts">
            <Link href={href({ deals: deals ? undefined : '1' })} className={`block py-0.5 hover:text-link-hover ${deals ? 'font-bold' : ''}`}>
              All Discounts
            </Link>
          </FilterGroup>
        </aside>

        <section className="min-w-0 flex-1">
          {/* mobile: category chips instead of the sidebar */}
          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto md:hidden">
            {categories.slice(0, 12).map(([c]) => (
              <Link key={c} href={href({ category: c === category ? undefined : c, brand: undefined })} className={`shrink-0 rounded-full border px-3 py-1 text-sm ${c === category ? 'border-link bg-[#edfdff] font-bold' : 'border-line bg-white'}`}>
                {categoryLabel(c)}
              </Link>
            ))}
            <Link href={href({ deals: deals ? undefined : '1' })} className={`shrink-0 rounded-full border px-3 py-1 text-sm ${deals ? 'border-link bg-[#edfdff] font-bold' : 'border-line bg-white'}`}>
              Deals
            </Link>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              {activeFilters.map(f => (
                <Link key={f.text} href={f.clear} className="flex items-center gap-1 rounded-full border border-line bg-[#f0f2f2] px-3 py-1 hover:bg-[#e3e6e6]">
                  {f.text} <span aria-label="remove filter">×</span>
                </Link>
              ))}
              <Link href={q ? `/s?q=${encodeURIComponent(q)}` : '/s'} className="link">
                Clear all
              </Link>
            </div>
          )}

          <h1 className="mb-1 text-xl font-bold">Results</h1>
          <p className="mb-4 text-sm text-muted">Check each product page for other buying options.</p>

          {shown.length === 0 ? (
            <div className="rounded-md border border-line p-8 text-center">
              <p className="text-lg font-bold">No results for {label}.</p>
              <p className="mt-2 text-sm text-muted">Try checking your spelling, using more general terms, or removing filters.</p>
              <Link href="/s" className="btn-cta mt-4">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map(p => (
                <ProductCard key={p.id} p={p} deliveryLabel={deliveryLabel} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex justify-center">
              <ul className="flex overflow-hidden rounded-md border border-line text-sm">
                <li>
                  {page > 1 ? (
                    <Link className="block px-4 py-2 hover:bg-[#f7fafa]" href={href({ page: page - 1 })}>‹ Previous</Link>
                  ) : (
                    <span className="block px-4 py-2 text-[#aaa]">‹ Previous</span>
                  )}
                </li>
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <li key={n} className="border-l border-line">
                    <Link aria-current={n === page ? 'page' : undefined} className={`block px-4 py-2 ${n === page ? 'border border-[#111] font-bold' : 'hover:bg-[#f7fafa]'}`} href={href({ page: n })}>
                      {n}
                    </Link>
                  </li>
                ))}
                <li className="border-l border-line">
                  {page < pages ? (
                    <Link className="block px-4 py-2 hover:bg-[#f7fafa]" href={href({ page: page + 1 })}>Next ›</Link>
                  ) : (
                    <span className="block px-4 py-2 text-[#aaa]">Next ›</span>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1 font-bold">{title}</h2>
      {children}
    </div>
  );
}
