import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Create account' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  if (await currentUser()) redirect('/');
  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute. No card needed.">
      <RegisterForm next={next} />
    </AuthShell>
  );
}
