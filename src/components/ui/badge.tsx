import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'promo' | 'new' | 'best' | 'outline' | 'soft';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  promo: 'bg-rose-500 text-white',
  new: 'bg-sky-500 text-white',
  best: 'bg-amber-500 text-white',
  outline: 'border border-border text-muted-foreground',
  soft: 'bg-primary-50 text-primary-700 dark:bg-primary-100 dark:text-primary-900',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
