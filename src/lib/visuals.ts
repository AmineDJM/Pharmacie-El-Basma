import { hashString } from './utils';

/**
 * Accent-based visual system. Each accent maps to fully-spelled Tailwind class
 * strings (required so the JIT compiler can detect them — never interpolate).
 */
export type AccentKey = 'emerald' | 'teal' | 'amber' | 'rose' | 'sky' | 'violet';

export interface AccentStyle {
  gradient: string; // strong gradient for icon tiles / CTA backgrounds
  soft: string; // soft tinted background
  softText: string; // readable text on soft background
  text: string; // accent text colour
  ring: string; // ring/border accent
  dot: string; // small solid swatch
}

export const ACCENTS: Record<AccentKey, AccentStyle> = {
  emerald: {
    gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    soft: 'bg-emerald-50 dark:bg-emerald-950/40',
    softText: 'text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    dot: 'bg-emerald-500',
  },
  teal: {
    gradient: 'bg-gradient-to-br from-teal-400 to-teal-600',
    soft: 'bg-teal-50 dark:bg-teal-950/40',
    softText: 'text-teal-700 dark:text-teal-300',
    text: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-200 dark:ring-teal-800',
    dot: 'bg-teal-500',
  },
  amber: {
    gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
    soft: 'bg-amber-50 dark:bg-amber-950/40',
    softText: 'text-amber-700 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-800',
    dot: 'bg-amber-500',
  },
  rose: {
    gradient: 'bg-gradient-to-br from-rose-400 to-pink-600',
    soft: 'bg-rose-50 dark:bg-rose-950/40',
    softText: 'text-rose-700 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-200 dark:ring-rose-800',
    dot: 'bg-rose-500',
  },
  sky: {
    gradient: 'bg-gradient-to-br from-sky-400 to-blue-600',
    soft: 'bg-sky-50 dark:bg-sky-950/40',
    softText: 'text-sky-700 dark:text-sky-300',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-200 dark:ring-sky-800',
    dot: 'bg-sky-500',
  },
  violet: {
    gradient: 'bg-gradient-to-br from-violet-400 to-purple-600',
    soft: 'bg-violet-50 dark:bg-violet-950/40',
    softText: 'text-violet-700 dark:text-violet-300',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-200 dark:ring-violet-800',
    dot: 'bg-violet-500',
  },
};

export const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[];

/** Resolve a possibly-invalid accent string to a valid AccentStyle. */
export function getAccent(accent?: string | null): AccentStyle {
  if (accent && accent in ACCENTS) return ACCENTS[accent as AccentKey];
  return ACCENTS.emerald;
}

/** Pick a stable accent for an arbitrary string (e.g. product/brand name). */
export function accentFor(seed: string): AccentKey {
  return ACCENT_KEYS[hashString(seed) % ACCENT_KEYS.length];
}
