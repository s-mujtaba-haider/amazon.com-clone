export function Stars({ rating, size = 16, className = '' }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} aria-hidden viewBox="0 0 24 24" width={size} height={size}>
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#de7921" />
                <stop offset={`${fill * 100}%`} stopColor="#fff" />
              </linearGradient>
            </defs>
            <path
              d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
              stroke="#de7921"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
