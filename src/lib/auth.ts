import 'server-only';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionData,
} from './session';

/** Read & verify the current admin session from cookies (server-side). */
export async function getCurrentUser(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Validate credentials against the database. Returns the user or null. */
export async function authenticate(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

/** Create a signed session cookie for the given user. */
export async function createSession(user: { id: string; email: string; name: string; role: string }) {
  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clear the session cookie (logout). */
export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Hash a plaintext password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
