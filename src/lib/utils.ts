import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes intelligently (conditional + de-duplicated). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in Algerian Dinars (DZD). */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' DA';
}

/** Compute the discount percentage between an old and a current price. */
export function discountPercent(price: number, oldPrice?: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Convert a string into a URL-friendly slug (accents removed). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Truncate text to a maximum length on a word boundary. */
export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).trimEnd() + '…';
}

/** Parse newline-separated highlights into an array. */
export function parseLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

/** Build an absolute URL from a path using the configured site origin. */
export function absoluteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://parapharmacie-elbasma.dz').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Build a wa.me URL with a pre-filled message. */
export function whatsappLink(number: string, message?: string): string {
  const clean = number.replace(/[^0-9]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${text}`;
}

/** Build a tel: link from a phone number. */
export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

/** Format an ISO date in long French form. */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/** Stable deterministic hash for picking visuals from a string. */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
