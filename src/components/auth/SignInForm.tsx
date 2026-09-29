'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { signIn, type AuthState } from '@/app/actions/auth';
import { FieldError, FormAlert } from './FormBits';

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, { step: 'email' });
  const [editing, setEditing] = useState(false);
  const step = editing ? 'email' : (state.step ?? 'email');
  const pwRef = useRef<HTMLInputElement>(null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (step === 'password') pwRef.current?.focus();
  }, [step, state]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
      {state.error && !editing && <FormAlert title="There was a problem">{state.error}</FormAlert>}

      <form action={fd => { setEditing(false); action(fd); }} noValidate>
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="step" value={step} />

        {step === 'email' ? (
          <>
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              defaultValue={state.email}
              aria-invalid={!!state.fieldErrors?.email}
              className={`field mt-1 ${state.fieldErrors?.email ? 'field-error' : ''}`}
            />
            <FieldError msg={state.fieldErrors?.email} />
            <button disabled={pending} className="btn-cta mt-5 w-full py-3 text-base">
              {pending ? 'Checking…' : 'Continue'}
            </button>
          </>
        ) : (
          <>
            <input type="hidden" name="email" value={state.email} />
            <p className="mb-4 rounded-xl bg-brand-50 px-3 py-2.5 text-sm">
              {state.name ? <>Welcome back, <b>{state.name.split(' ')[0]}</b> · </> : null}
              {state.email}{' '}
              <button type="button" onClick={() => setEditing(true)} className="link">
                Change
              </button>
            </p>
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <button type="button" onClick={() => setShowPw(s => !s)} className="link text-xs">
                {showPw ? 'Hide' : 'Show'} password
              </button>
            </div>
            <input
              ref={pwRef}
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              aria-invalid={!!state.fieldErrors?.password}
              className={`field mt-1 ${state.fieldErrors?.password ? 'field-error' : ''}`}
            />
            <FieldError msg={state.fieldErrors?.password} />
            <button disabled={pending} className="btn-cta mt-5 w-full py-3 text-base">
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" name="remember" defaultChecked /> Keep me signed in
            </label>
          </>
        )}
      </form>

      <p className="mt-5 text-xs leading-relaxed">
        By continuing, you agree to Kyro&apos;s <Link href="/" className="link">Conditions of Use</Link> and{' '}
        <Link href="/" className="link">Privacy Notice</Link>.
      </p>
    </div>
  );
}
