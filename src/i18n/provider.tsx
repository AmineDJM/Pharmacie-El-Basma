'use client';

import { createContext, useContext, useMemo } from 'react';
import { makeT, type TFunction } from './translate';
import type { Dictionary, Locale } from './config';

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  t: TFunction;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => ({ locale, dict, t: makeT(dict) }), [locale, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé dans LocaleProvider');
  return ctx;
}

export const useT = (): TFunction => useI18n().t;
export const useLocale = (): Locale => useI18n().locale;
