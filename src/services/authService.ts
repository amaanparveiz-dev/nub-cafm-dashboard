/**
 * Mock authentication API.
 *
 * SECURITY: everything here runs in the browser, so it is a UI demo only. In
 * production the server must verify credentials, rate-limit, and issue an
 * HttpOnly + Secure + SameSite session cookie. Never keep tokens in localStorage.
 *
 * Replace `authenticate` with a real call, e.g.:
 *   const res = await fetch('/api/auth/login', { method: 'POST', credentials: 'include',
 *     headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
 *   if (res.status === 401) throw new AuthError('bad_credentials');
 *   if (!res.ok) throw new AuthError('network');
 *   return res.json();
 */
import type { AuthErrorCode, User } from '../types';

export const DEMO_ACCOUNT = {
  email: 'dev@bits.sa',
  password: 'Demo@1234',
  name: 'Usama Jumaloon',
  nameAr: 'اسامة جومالون',
} as const;

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function demoUser(): User {
  const { name, nameAr, email } = DEMO_ACCOUNT;
  return { name, nameAr, email };
}

export async function authenticate(email: string, password: string): Promise<User> {
  await wait(850);
  if (email.toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
    return demoUser();
  }
  throw new AuthError('bad_credentials');
}

/** Mock Azure / Entra ID sign-in for the demo workspace. */
export async function authenticateWithAzure(): Promise<User> {
  await wait(900);
  return demoUser();
}

/** Always resolves so the UI never reveals whether an account exists. */
export async function requestPasswordReset(_email: string): Promise<void> {
  await wait(800);
}
