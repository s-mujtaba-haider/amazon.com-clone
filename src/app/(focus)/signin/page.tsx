import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignInForm } from '@/components/auth/SignInForm';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  if (await currentUser()) redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/');

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, see your wishlist and check out faster.">
      <SignInForm next={next} />
      <div className="relative my-6 text-center text-sm text-muted">
        <span className="absolute inset-x-0 top-1/2 border-t border-line" />
        <span className="relative bg-page px-3">New to Shopora?</span>
      </div>
      <Link href={`/register?next=${encodeURIComponent(next)}`} className="btn-secondary w-full py-3">
        Create your account
      </Link>
    </AuthShell>
  );
}
