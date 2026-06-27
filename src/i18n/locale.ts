import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { defaultLocale, isLocale, LOCALE_COOKIE, type Dictionary, type Locale } from './config';
import { makeT, type TFunction } from './translate';
import fr from './dictionaries/fr';
import ar from './dictionaries/ar';
import en from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = { fr, ar, en };

/** Resolve the active locale from the cookie (request-cached). */
export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  return isLocale(store.get(LOCALE_COOKIE)?.value) ? (store.get(LOCALE_COOKIE)!.value as Locale) : defaultLocale;
});

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fr;
}

/** Convenience: locale + translation function for server components. */
export const getI18n = cache(async (): Promise<{ locale: Locale; dict: Dictionary; t: TFunction }> => {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { locale, dict, t: makeT(dict) };
});
