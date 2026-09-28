import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FocusLogo } from '@/components/layout/FocusLogo';
import { SignInForm } from '@/components/auth/SignInForm';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Sign-In' };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  if (await currentUser()) redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/');

  return (
    <div className="px-4">
      <FocusLogo />
      <div className="mx-auto w-full max-w-[350px]">
        <SignInForm next={next} />
        <div className="relative my-6 text-center text-xs text-muted">
          <span className="absolute inset-x-0 top-1/2 border-t border-line" />
          <span className="relative bg-white px-2">New to Shopora?</span>
        </div>
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="btn-secondary w-full">
          Create your Shopora account
        </Link>
      </div>
    </div>
  );
}
