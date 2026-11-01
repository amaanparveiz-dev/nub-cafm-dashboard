import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants/config';
import { MESSAGES, type Locale, type MessageKey } from '../i18n/messages';
import { localStore } from '../utils/storage';

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translate;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => (
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  ));
}

function readLocale(): Locale {
  const stored = localStore.get(STORAGE_KEYS.locale);
  if (stored === 'ar' || stored === 'en') return stored;
  try {
    return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStore.set(STORAGE_KEYS.locale, next);
    applyDocumentLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const t = useCallback<Translate>((key, vars) => (
    interpolate(MESSAGES[locale][key] ?? MESSAGES.en[key] ?? key, vars)
  ), [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    setLocale,
    toggleLocale,
    t,
  }), [locale, setLocale, toggleLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>');
  return context;
}
