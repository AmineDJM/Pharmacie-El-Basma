export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';
export const rtlLocales: Locale[] = ['ar'];

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const localeNames: Record<Locale, { native: string; label: string }> = {
  fr: { native: 'Français', label: 'FR' },
  ar: { native: 'العربية', label: 'AR' },
  en: { native: 'English', label: 'EN' },
};

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export type Dictionary = typeof import('./dictionaries/fr').default;
