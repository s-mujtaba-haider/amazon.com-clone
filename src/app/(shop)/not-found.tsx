import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto my-10 max-w-xl rounded-3xl bg-white px-6 py-14 text-center shadow-[var(--shadow-soft)]">
      <p className="text-6xl">🔎</p>
      <h1 className="mt-4 text-2xl font-bold">Sorry, we couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">Try searching or go to the home page.</p>
      <Link href="/" className="btn-cta mt-6">
        Go to the Shopora home page
      </Link>
    </div>
  );
}
