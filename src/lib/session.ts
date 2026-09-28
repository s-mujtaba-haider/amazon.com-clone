import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { findUserById } from './db';

const COOKIE = 'shopora_session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'dev-only-secret-change-me-in-production-please');

export async function startSession(userId: string, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in user (without password hash), or null. Cached per request. */
export const currentUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const user = payload.sub ? findUserById(payload.sub) : null;
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch {
    return null;
  }
});
