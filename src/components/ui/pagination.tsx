import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({
  page,
  pages,
  basePath,
  params = {},
}: {
  page: number;
  pages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set('page', String(p));
    else sp.delete('page');
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  const linkClass = 'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent';

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={href(page - 1)} className={linkClass} aria-label="Page précédente" scroll>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {nums.map((n, i) => {
        const prev = nums[i - 1];
        return (
          <span key={n} className="flex items-center gap-1.5">
            {prev && n - prev > 1 && <span className="px-1 text-muted-foreground">…</span>}
            <Link
              href={href(n)}
              className={cn(linkClass, n === page && 'border-primary bg-primary text-primary-foreground hover:bg-primary')}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </Link>
          </span>
        );
      })}
      {page < pages && (
        <Link href={href(page + 1)} className={linkClass} aria-label="Page suivante" scroll>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
