import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Stars } from '@/components/product/Stars';
import { SortSelect } from '@/components/search/SortSelect';
import { FilterSheet } from '@/components/search/FilterSheet';
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

  const filters = (
    <div className="space-y-6">
      <FilterGroup title="Department">
        {category && (
          <Opt href={href({ category: undefined, brand: undefined })}>
            <span className="text-muted">‹ Any department</span>
          </Opt>
        )}
        {categories.map(([c, n]) => (
          <Opt key={c} href={href({ category: c, brand: undefined })} on={c === category}>
            <span className="flex-1">{categoryLabel(c)}</span>
            <span className="text-xs text-muted">{n}</span>
          </Opt>
        ))}
      </FilterGroup>

      <FilterGroup title="Customer reviews">
        {[4, 3, 2].map(r => (
          <Opt key={r} href={href({ rating: rating === r ? undefined : r })} on={rating === r}>
            <Stars rating={r} size={16} /> <span>&amp; up</span>
          </Opt>
        ))}
      </FilterGroup>

      {brands.length > 0 && (
        <FilterGroup title="Brands">
          {brands.map(([b]) => (
            <Opt key={b} href={href({ brand: brand === b ? undefined : b })} on={brand === b} check>
              {b}
            </Opt>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        {PRICE_BANDS.map(([t, lo, hi]) => {
          const on = min === lo && max === hi;
          return (
            <Opt key={t} href={on ? href({ min: undefined, max: undefined }) : href({ min: lo, max: hi })} on={on}>
              {t}
            </Opt>
          );
        })}
        <form action="/s" className="mt-2 flex items-center gap-1.5">
          {/* keep every other active filter when a custom range is applied */}
          {Object.entries({ q: q || undefined, category, brand, rating, deals: deals ? '1' : undefined, sort: sort !== 'featured' ? sort : undefined }).map(([k, v]) =>
            v !== undefined ? <input key={k} type="hidden" name={k} value={String(v)} /> : null,
          )}
          <input name="min" inputMode="numeric" placeholder="$ Min" defaultValue={min} className="field min-w-0 flex-1 px-2.5 py-1.5 text-sm" aria-label="Minimum price" />
          <input name="max" inputMode="numeric" placeholder="$ Max" defaultValue={max} className="field min-w-0 flex-1 px-2.5 py-1.5 text-sm" aria-label="Maximum price" />
          <button className="btn-secondary px-3 py-1.5">Go</button>
        </form>
      </FilterGroup>

      <FilterGroup title="Deals & discounts">
        <Opt href={href({ deals: deals ? undefined : '1' })} on={deals} check>
          Discounted items only
        </Opt>
      </FilterGroup>
    </div>
  );

  return (
    <div>
      <div className="gutter flex flex-wrap items-center justify-between gap-2 pt-4 pb-2 text-sm sm:pt-6">
        <p className="w-full text-muted sm:w-auto">
          {results.length === 0 ? 'No' : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, results.length)} of`} {results.length > 0 && results.length} results for{' '}
          <span className="font-bold text-ink">{label}</span>
        </p>
        <SortSelect value={sort} />
      </div>

      <div className="gutter flex gap-6 pb-10 xl:gap-8">
        <aside data-reveal="left" className="no-scrollbar sticky top-[132px] hidden max-h-[calc(100dvh-148px)] w-56 shrink-0 self-start overflow-y-auto rounded-3xl bg-white p-4 text-sm shadow-[var(--shadow-soft)] md:block lg:w-64" aria-label="Filters">
          {filters}
        </aside>

        <section className="min-w-0 flex-1">
          {/* mobile: category chips instead of the sidebar */}
          <div className="no-scrollbar -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 sm:-mx-6 sm:px-6 md:hidden">
            <FilterSheet activeCount={activeFilters.length} resultCount={results.length}>
              {filters}
            </FilterSheet>
            {categories.slice(0, 12).map(([c]) => (
              <Link key={c} href={href({ category: c === category ? undefined : c, brand: undefined })} className={`chip ${c === category ? 'chip-on' : ''}`}>
                {categoryLabel(c)}
              </Link>
            ))}
            <Link href={href({ deals: deals ? undefined : '1' })} className={`chip ${deals ? 'chip-on' : ''}`}>
              Deals
            </Link>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              {activeFilters.map(f => (
                <Link key={f.text} href={f.clear} className="chip chip-on">
                  {f.text} <span aria-label="remove filter">×</span>
                </Link>
              ))}
              <Link href={q ? `/s?q=${encodeURIComponent(q)}` : '/s'} className="link">
                Clear all
              </Link>
            </div>
          )}

          <h1 className="page-title mb-4">{q ? <>Results for &ldquo;{q}&rdquo;</> : category ? categoryLabel(category) : deals ? "Today's Deals" : 'All products'}</h1>

          {shown.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden className="empty-icon">🔍</span>
              <p className="mt-5 text-lg font-bold">No results for {label}.</p>
              <p className="mt-2 text-sm text-muted">Try checking your spelling, using more general terms, or removing filters.</p>
              <Link href="/s" className="btn-cta mt-4">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {shown.map((p, i) => (
                <ProductCard key={p.id} p={p} deliveryLabel={deliveryLabel} index={i} priority={i < 6} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex justify-center">
              <ul className="flex flex-wrap justify-center gap-1.5 text-sm">
                <li>
                  {page > 1 ? (
                    <Link className="block rounded-xl bg-white px-4 py-2 font-semibold shadow-[var(--shadow-soft)] transition hover:bg-brand-50 hover:text-brand" href={href({ page: page - 1 })}>‹ Previous</Link>
                  ) : (
                    <span className="block rounded-xl px-4 py-2 text-[#b0b7c5]">‹ Previous</span>
                  )}
                </li>
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <li key={n}>
                    <Link aria-current={n === page ? 'page' : undefined} className={`block min-w-10 rounded-xl px-3.5 py-2 text-center font-semibold transition ${n === page ? 'bg-brand text-white shadow-[0_6px_16px_-6px_rgba(91,61,245,.6)]' : 'bg-white shadow-[var(--shadow-soft)] hover:bg-brand-50 hover:text-brand'}`} href={href({ page: n })}>
                      {n}
                    </Link>
                  </li>
                ))}
                <li>
                  {page < pages ? (
                    <Link className="block rounded-xl bg-white px-4 py-2 font-semibold shadow-[var(--shadow-soft)] transition hover:bg-brand-50 hover:text-brand" href={href({ page: page + 1 })}>Next ›</Link>
                  ) : (
                    <span className="block rounded-xl px-4 py-2 text-[#b0b7c5]">Next ›</span>
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
      <h2 className="popover-label">{title}</h2>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/** One filter row: same look for departments, ratings, brands, prices and deals. `check` shows a checkbox. */
function Opt({ href, on = false, check = false, children }: { href: string; on?: boolean; check?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={on ? 'true' : undefined}
      className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors ${on ? 'bg-brand-50 font-bold text-brand-700' : 'hover:bg-[#f5f6fa] hover:text-brand'}`}
    >
      {check && (
        <span aria-hidden className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border-2 transition ${on ? 'border-brand bg-brand text-white' : 'border-[#c5cad6]'}`}>
          {on && (
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[4]">
              <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      )}
      {children}
      {on && !check && (
        <svg aria-hidden viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0 fill-none stroke-brand stroke-[3]">
          <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Link>
  );
}
