import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { NotFoundCard } from '@/components/ui/NotFoundCard';

export const metadata: Metadata = { title: 'Page not found' };

/** 404 for URLs outside every route group (the shop group has its own, inside the full header). */
export default function RootNotFound() {
  return (
    <>
      <header className="bg-ink">
        <div className="gutter flex py-3.5">
          <Link href="/" className="text-2xl" aria-label="Kyro home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="gutter flex-1">
        <NotFoundCard />
      </main>
    </>
  );
}
