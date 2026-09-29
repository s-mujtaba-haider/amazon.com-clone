import Link from 'next/link';

const TINTS = ['#5b3df5', '#ff6b3d', '#12b886', '#db2777', '#0ea5e9', '#f59e0b', '#7c3aed', '#0f766e'];

function tint(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TINTS[h % TINTS.length];
}

function Row({ items, reverse = false, duration }: { items: string[]; reverse?: boolean; duration: number }) {
  return (
    <div className={`marquee overflow-hidden py-1.5 ${reverse ? 'marquee-reverse' : ''}`} style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}>
      <div className="marquee-track">
        {[...items, ...items].map((b, i) => {
          const copy = i >= items.length;
          const c = tint(b);
          return (
            <span key={i} className="pr-3" aria-hidden={copy || undefined}>
              <Link
                href={`/s?brand=${encodeURIComponent(b)}`}
                tabIndex={copy ? -1 : undefined}
                className="group flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-5 pl-1.5 text-sm font-bold whitespace-nowrap text-[#334155] shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--c)] hover:text-white hover:shadow-[var(--shadow-lift)]"
                style={{ '--c': c } as React.CSSProperties}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-extrabold text-white transition duration-300 group-hover:rotate-[360deg] bg-[var(--c)] group-hover:bg-white/20">
                  {b[0]}
                </span>
                {b}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Two rows of brand chips gliding in opposite directions; each chip fills with its colour on hover. */
export function BrandMarquee({ brands }: { brands: string[] }) {
  const half = Math.ceil(brands.length / 2);
  const top = brands.slice(0, half);
  const bottom = brands.slice(half);
  return (
    <section aria-label="Popular brands" data-reveal className="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-brand-50 py-5 shadow-[var(--shadow-soft)] ring-1 ring-black/[.03] sm:py-6">
      <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:mb-4 sm:px-6">
        <h2 className="section-title title-bar">Shop by brand</h2>
        <Link href="/s" className="text-sm font-semibold text-brand hover:underline">
          All brands →
        </Link>
      </div>
      <div className="space-y-1">
        <Row items={top} duration={Math.max(top.length * 3.2, 24)} />
        {bottom.length > 0 && <Row items={bottom} reverse duration={Math.max(bottom.length * 3.6, 26)} />}
      </div>
    </section>
  );
}
