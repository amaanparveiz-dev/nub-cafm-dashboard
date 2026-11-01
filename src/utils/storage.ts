export interface SafeStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** Storage wrappers that never throw (private mode, quota, disabled storage). */
const createStore = (getArea: () => Storage): SafeStore => ({
  get(key) {
    try { return getArea().getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { getArea().setItem(key, value); } catch { /* ignore */ }
  },
  remove(key) {
    try { getArea().removeItem(key); } catch { /* ignore */ }
  },
});

export const localStore = createStore(() => window.localStorage);
export const sessionStore = createStore(() => window.sessionStorage);

/** Parses JSON, returning `fallback` for null, invalid, or `null`-valued input. */
export function parseJson<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try { return (JSON.parse(raw) as T | null) ?? fallback; } catch { return fallback; }
}
