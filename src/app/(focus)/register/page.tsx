import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FocusLogo } from '@/components/layout/FocusLogo';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Create account' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  if (await currentUser()) redirect('/');
  return (
    <div className="px-4">
      <FocusLogo />
      <div className="mx-auto w-full max-w-[350px]">
        <RegisterForm next={next} />
      </div>
    </div>
  );
}
