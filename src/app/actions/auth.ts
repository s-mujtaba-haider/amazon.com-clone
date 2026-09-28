'use server';

import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { createUser, findUserByEmail } from '@/lib/db';
import { endSession, startSession } from '@/lib/session';

export type AuthState = {
  step?: 'email' | 'password';
  email?: string;
  name?: string;
  error?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only allow same-site relative redirects. */
function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === 'string' ? v : '';
  return s.startsWith('/') && !s.startsWith('//') ? s : '/';
}

/** Two-step sign-in: identify by email first, then ask for the password. */
export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const step = form.get('step');

  if (!email) return { step: 'email', fieldErrors: { email: 'Enter your email' } };
  if (!EMAIL_RE.test(email)) return { step: 'email', email, fieldErrors: { email: 'Enter a valid email address' } };

  const user = findUserByEmail(email);
  if (step === 'email') {
    if (!user) return { step: 'email', email, error: 'We cannot find an account with that email address' };
    return { step: 'password', email, name: user.name };
  }

  const password = String(form.get('password') ?? '');
  if (!password) return { step: 'password', email, name: user?.name, fieldErrors: { password: 'Enter your password' } };
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { step: 'password', email, name: user?.name, error: 'Your password is incorrect' };
  }
  await startSession(user.id, form.get('remember') === 'on');
  redirect(safeNext(form.get('next')));
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  const fieldErrors: AuthState['fieldErrors'] = {};
  if (!name) fieldErrors.name = 'Enter your name';
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email address';
  if (password.length < 6) fieldErrors.password = 'Minimum 6 characters required';
  if (password !== confirm) fieldErrors.confirm = 'Passwords must match';
  if (Object.keys(fieldErrors).length) return { name, email, fieldErrors };

  if (findUserByEmail(email)) {
    return { name, email, error: 'An account already exists with this email. Sign in instead.' };
  }

  const id = randomUUID();
  createUser({ id, name, email, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() });
  await startSession(id, true);
  redirect(safeNext(form.get('next')));
}

export async function signOut() {
  await endSession();
  redirect('/');
}
