import { AUTH_CONFIG, STORAGE_KEYS } from '../constants/config';
import type { User } from '../types';
import { localStore, parseJson, sessionStore } from './storage';

const KEY = STORAGE_KEYS.session;

type StoredSession = User & { exp: number };

export function clearSession(): void {
  localStore.remove(KEY);
  sessionStore.remove(KEY);
}

/** Returns the stored user, or null when there is no valid (unexpired) session. */
export function readSession(): User | null {
  const session = parseJson<StoredSession | null>(localStore.get(KEY) ?? sessionStore.get(KEY), null);
  if (!session || session.exp <= Date.now()) {
    clearSession();
    return null;
  }
  const { exp: _exp, ...user } = session;
  return user;
}

export function writeSession(user: User, remember: boolean): void {
  const ttl = remember ? AUTH_CONFIG.rememberDays * 864e5 : AUTH_CONFIG.sessionHours * 36e5;
  clearSession();
  (remember ? localStore : sessionStore).set(KEY, JSON.stringify({ ...user, exp: Date.now() + ttl }));
}
