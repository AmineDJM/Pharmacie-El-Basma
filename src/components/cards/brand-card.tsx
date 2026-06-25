import Link from 'next/link';
import { getAccent } from '@/lib/visuals';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name
    .replace(/[^a-zA-ZÀ-ÿ\s-]/g, '')
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function BrandCard({
  brand,
  className,
}: {
  brand: { name: string; slug: string; accent: string; _count?: { products: number } };
  className?: string;
}) {
  const a = getAccent(brand.accent);
  return (
    <Link
      href={`/marques/${brand.slug}`}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white shadow-soft',
          a.gradient,
        )}
      >
        {initials(brand.name)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
          {brand.name}
        </p>
        {brand._count && (
          <p className="text-xs text-muted-foreground">{brand._count.products} produits</p>
        )}
      </div>
    </Link>
  );
}
