import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Brand mark: a soft medical cross fused with a leaf, in the house gradient. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Parapharmacie El Basma">
      <defs>
        <linearGradient id="elbasma-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(162 74% 38%)" />
          <stop offset="1" stopColor="hsl(168 76% 24%)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#elbasma-mark)" />
      <path
        d="M20 9c-4.2 3.1-6.4 6.8-6.4 10.7 0 3.7 2.6 6.6 6.4 6.6s6.4-2.9 6.4-6.6C26.4 15.8 24.2 12.1 20 9Z"
        fill="white"
        fillOpacity="0.92"
      />
      <path d="M20 16.5v11" stroke="hsl(165 76% 24%)" strokeWidth="2" strokeLinecap="round" />
      <rect x="17.4" y="29.5" width="5.2" height="2.2" rx="1.1" fill="white" fillOpacity="0.92" />
    </svg>
  );
}

export function Logo({
  className,
  href = '/',
  textClassName,
}: {
  className?: string;
  href?: string;
  textClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="Parapharmacie El Basma — Accueil"
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <span className={cn('flex flex-col leading-none', textClassName)}>
        <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary">
          Parapharmacie
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          El Basma
        </span>
      </span>
    </Link>
  );
}
