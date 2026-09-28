'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const OPTIONS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
  ['rating', 'Avg. Customer Review'],
  ['discount', 'Biggest Discount'],
] as const;

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm text-muted shadow-[var(--shadow-soft)]">
      Sort by:
      <select
        value={value}
        onChange={e => {
          const sp = new URLSearchParams(params.toString());
          if (e.target.value === 'featured') sp.delete('sort');
          else sp.set('sort', e.target.value);
          sp.delete('page');
          router.push(`${pathname}?${sp.toString()}`);
        }}
        className="cursor-pointer bg-transparent font-semibold text-ink outline-none"
      >
        {OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
