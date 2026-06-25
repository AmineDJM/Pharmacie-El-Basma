import { type LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-100">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}
