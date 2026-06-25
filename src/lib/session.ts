import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * Edge-safe session token helpers (jose only — no Node APIs).
 * Imported by both the middleware (edge) and server code.
 */

export const SESSION_COOKIE = 'elbasma_session';
const ALG = 'HS256';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionData extends JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'insecure-development-secret-change-me-please';
  return new TextEncoder().encode(secret);
}

export async function signSession(data: Omit<SessionData, keyof JWTPayload>): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySession(token?: string): Promise<SessionData | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: [ALG] });
    return payload as SessionData;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE;
