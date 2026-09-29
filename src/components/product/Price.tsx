import { listPrice, money, priceParts } from '@/lib/format';

/** Big superscript-cents price, optionally with the struck-through list price and % off. */
export function Price({
  price,
  discount = 0,
  size = 'md',
  showList = true,
}: {
  price: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
  showList?: boolean;
}) {
  const { whole, cents } = priceParts(price);
  const big = { sm: 'text-xl', md: 'text-[30px]', lg: 'text-[34px] sm:text-[40px]' }[size];
  const hasDeal = discount >= 5;
  return (
    <div>
      <div className="flex items-start gap-2">
        {hasDeal && size === 'lg' && <span className="mt-1 rounded-full bg-deal px-2.5 py-1 text-sm font-bold text-white">-{Math.round(discount)}%</span>}
        <span className="flex items-start leading-none" aria-label={money(price)}>
          <span aria-hidden className="mt-1 text-xs">$</span>
          <span aria-hidden className={`${big} leading-none font-extrabold tracking-tight`}>{whole}</span>
          <span aria-hidden className="mt-1 text-xs">{cents}</span>
        </span>
      </div>
      {hasDeal && showList && (
        <div className="mt-1 text-xs text-muted">
          List Price: <span className="line-through">{money(listPrice(price, discount))}</span>
        </div>
      )}
    </div>
  );
}
