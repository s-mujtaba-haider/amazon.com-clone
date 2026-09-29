'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, type SelectOption } from '@/components/ui/Select';

const OPTIONS: SelectOption<string>[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'discount', label: 'Biggest Discount' },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <Select
      label="Sort by"
      value={value}
      options={OPTIONS}
      className="w-full sm:w-auto sm:min-w-60"
      onChange={v => {
        const sp = new URLSearchParams(params.toString());
        if (v === 'featured') sp.delete('sort');
        else sp.set('sort', v);
        sp.delete('page');
        router.push(`${pathname}?${sp.toString()}`);
      }}
    />
  );
}
