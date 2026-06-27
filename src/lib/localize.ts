import type { Locale } from '@/i18n/config';

type Translatable = { translations?: unknown };

/** Extract the translation map for a locale from a record's `translations` JSON. */
function trMap(record: Translatable, locale: Locale): Record<string, string> | null {
  if (locale === 'fr') return null;
  const t = record.translations as Record<string, Record<string, string>> | null | undefined;
  const m = t?.[locale];
  return m && typeof m === 'object' ? m : null;
}

/** Localised value of a single field (falls back to the provided base value). */
export function tField(record: Translatable, locale: Locale, field: string, fallback: string): string {
  const v = trMap(record, locale)?.[field];
  return v && typeof v === 'string' && v.trim() ? v : fallback;
}

/** Return a shallow copy of `record` with the given fields localised. */
export function localize<T extends Translatable & Record<string, unknown>>(
  record: T,
  locale: Locale,
  fields: string[],
): T {
  const m = trMap(record, locale);
  if (!m) return record;
  const out = { ...record } as Record<string, unknown>;
  for (const f of fields) {
    const v = m[f];
    if (v && typeof v === 'string' && v.trim()) out[f] = v;
  }
  return out as T;
}
