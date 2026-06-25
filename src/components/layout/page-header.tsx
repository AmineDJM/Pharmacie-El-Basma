import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { Eyebrow } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  children,
  align = 'left',
}: {
  breadcrumbs?: Crumb[];
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 to-background dark:from-primary-50/10" />
      <div className="container py-8 sm:py-12">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={cn('mt-5 flex flex-col gap-4', align === 'center' && 'items-center text-center')}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
