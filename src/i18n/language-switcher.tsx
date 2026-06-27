'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeNames, LOCALE_COOKIE, isRtl, type Locale } from './config';
import { useLocale } from './provider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const choose = (l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    document.documentElement.dir = isRtl(l) ? 'rtl' : 'ltr';
    setOpen(false);
    router.refresh();
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Choisir la langue"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Globe className="h-[1.05rem] w-[1.05rem]" />
        <span className="hidden sm:inline">{localeNames[locale].label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute end-0 z-[70] mt-2 w-40 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lift animate-fade-in">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => choose(l)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-accent',
                l === locale ? 'font-semibold text-primary' : 'text-foreground',
              )}
            >
              <span>{localeNames[l].native}</span>
              {l === locale && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
