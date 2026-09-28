'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { signUp, type AuthState } from '@/app/actions/auth';
import { FieldError, FormAlert } from './FormBits';

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {});
  const [pw, setPw] = useState('');
  const fe = state.fieldErrors ?? {};

  const field = (name: 'name' | 'email' | 'password' | 'confirm', label: string, type: string, autoComplete: string, extra?: React.ReactNode) => (
    <div className="mb-3">
      <label htmlFor={name} className="text-[13px] font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={name === 'name' ? state.name : name === 'email' ? state.email : undefined}
        onChange={name === 'password' ? e => setPw(e.target.value) : undefined}
        placeholder={name === 'password' ? 'At least 6 characters' : name === 'name' ? 'First and last name' : undefined}
        aria-invalid={!!fe[name]}
        className={`field mt-1 ${fe[name] ? 'field-error' : ''}`}
      />
      {extra}
      <FieldError msg={fe[name]} />
    </div>
  );

  return (
    <div className="rounded-lg border border-line p-6">
      <h1 className="mb-4 text-[28px] font-normal">Create account</h1>
      {state.error && (
        <FormAlert title="There was a problem">
          {state.error}{' '}
          <Link href={`/signin?next=${encodeURIComponent(next)}`} className="link">
            Sign in
          </Link>
        </FormAlert>
      )}
      <form action={action} noValidate>
        <input type="hidden" name="next" value={next} />
        {field('name', 'Your name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field(
          'password',
          'Password',
          'password',
          'new-password',
          !fe.password && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${pw.length >= 6 ? 'text-success' : 'text-muted'}`}>
              <span aria-hidden className="font-bold">i</span> {pw.length >= 6 ? 'Looks good' : 'Passwords must be at least 6 characters.'}
            </p>
          ),
        )}
        {field('confirm', 'Re-enter password', 'password', 'new-password')}
        <button disabled={pending} className="btn-cta mt-2 w-full rounded-lg py-2">
          {pending ? 'Creating your account…' : 'Create your Shopora account'}
        </button>
      </form>
      <p className="mt-5 text-xs leading-relaxed">
        By creating an account, you agree to Shopora&apos;s <Link href="/" className="link">Conditions of Use</Link> and{' '}
        <Link href="/" className="link">Privacy Notice</Link>.
      </p>
      <hr className="my-5 border-line" />
      <p className="text-sm">
        Already have an account?{' '}
        <Link href={`/signin?next=${encodeURIComponent(next)}`} className="link">
          Sign in ›
        </Link>
      </p>
    </div>
  );
}
