import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-6xl">🔎</p>
      <h1 className="mt-4 text-2xl font-bold">Sorry, we couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">Try searching or go to the home page.</p>
      <Link href="/" className="btn-cta mt-6">
        Go to the Shopora home page
      </Link>
    </div>
  );
}
