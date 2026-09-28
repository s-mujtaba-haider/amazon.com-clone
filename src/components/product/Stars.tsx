const STAR = 'm12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';

function Row({ size, filled }: { size: number; filled: boolean }) {
  return (
    <span className="flex">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} aria-hidden viewBox="0 0 24 24" width={size} height={size} className="shrink-0">
          <path d={STAR} fill={filled ? '#de7921' : '#fff'} stroke="#de7921" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Partial stars via a clipped overlay (no SVG gradient ids: ids collide across the page and
 * fail to paint when their first definition sits inside a display:none subtree).
 */
export function Stars({ rating, size = 16, className = '' }: { rating: number; size?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <Row size={size} filled={false} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <Row size={size} filled />
      </span>
    </span>
  );
}
