import { useCallback, useEffect, useState } from 'react';
import { AUTH_CONFIG, STORAGE_KEYS } from '../constants/config';
import type { LockResult, LockState } from '../types';
import { localStore, parseJson } from '../utils/storage';

const readLock = (): LockState => parseJson<LockState>(localStore.get(STORAGE_KEYS.lock), {});
const writeLock = (lock: LockState): void => localStore.set(STORAGE_KEYS.lock, JSON.stringify(lock));
const secondsRemaining = (): number =>
  Math.max(0, Math.ceil(((readLock().until || 0) - Date.now()) / 1000));

export interface LockoutApi {
  isLocked: boolean;
  secondsLeft: number;
  recordFailure: () => LockResult;
  reset: () => void;
}

/** UI-level sign-in throttling (the real limit must be enforced by the server). */
export default function useLockout(): LockoutApi {
  const [secondsLeft, setSecondsLeft] = useState(secondsRemaining);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setInterval(() => setSecondsLeft(secondsRemaining()), 500);
    return () => clearInterval(timer);
  }, [secondsLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const recordFailure = useCallback((): LockResult => {
    const fails = (readLock().fails || 0) + 1;
    if (fails >= AUTH_CONFIG.maxFails) {
      writeLock({ fails: 0, until: Date.now() + AUTH_CONFIG.lockMs });
      setSecondsLeft(secondsRemaining());
      return { locked: true, attemptsLeft: 0 };
    }
    writeLock({ fails, until: 0 });
    return { locked: false, attemptsLeft: AUTH_CONFIG.maxFails - fails };
  }, []);

  const reset = useCallback(() => writeLock({}), []);

  return { isLocked: secondsLeft > 0, secondsLeft, recordFailure, reset };
}
