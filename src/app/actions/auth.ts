'use server';

import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { StorageNotConfiguredError, createUser, findUserByEmail } from '@/lib/db';
import { endSession, startSession } from '@/lib/session';

export type AuthState = {
  step?: 'email' | 'password';
  email?: string;
  name?: string;
  error?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function storageMessage(e: unknown) {
  console.error('[auth] storage error', e);
  return e instanceof StorageNotConfiguredError
    ? 'Sign-in is temporarily unavailable: account storage is not set up on this deployment.'
    : 'Something went wrong on our side. Please try again.';
}

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

  let user;
  try {
    user = await findUserByEmail(email);
  } catch (e) {
    return { step: 'email', email, error: storageMessage(e) };
  }
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

  const taken = { name, email, error: 'An account already exists with this email. Sign in instead.' };
  const id = randomUUID();
  try {
    if (await findUserByEmail(email)) return taken;
    const created = await createUser({ id, name, email, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() });
    if (!created) return taken;
  } catch (e) {
    return { name, email, error: storageMessage(e) };
  }
  await startSession(id, true);
  redirect(safeNext(form.get('next')));
}

export async function signOut() {
  await endSession();
  redirect('/');
}
