import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:bg-primary-100 dark:text-primary-900',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          'max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
          Tag === 'h1' && 'text-4xl sm:text-5xl lg:text-6xl',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
