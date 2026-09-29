import Link from 'next/link';

export function NotFoundCard() {
  return (
    <div className="empty-state my-10" data-reveal>
      <span aria-hidden className="empty-icon">🔎</span>
      <p className="mt-5 bg-gradient-to-r from-brand to-coral bg-clip-text text-6xl font-extrabold tracking-tighter text-transparent">404</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Sorry, we couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">It may have moved, or the link might be broken.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-cta px-6 py-3">
          Go to the home page
        </Link>
        <Link href="/s?deals=1&sort=discount" className="btn-secondary px-6 py-3">
          Browse deals
        </Link>
      </div>
    </div>
  );
}
