'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/category-icon';
import { useLocale } from '@/i18n/provider';
import { tField } from '@/lib/localize';
import { getAccent } from '@/lib/visuals';
import { cn } from '@/lib/utils';

export function CategoryCard({
  category,
  className,
}: {
  category: {
    name: string;
    slug: string;
    icon?: string | null;
    accent: string;
    description?: string | null;
    translations?: unknown;
    _count?: { products: number };
  };
  className?: string;
}) {
  const locale = useLocale();
  const a = getAccent(category.accent);
  const name = tField({ translations: category.translations }, locale, 'name', category.name);
  const description = category.description
    ? tField({ translations: category.translations }, locale, 'description', category.description)
    : null;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className={cn('absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20', a.dot)} />
      <div className={cn('inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft', a.gradient)}>
        <CategoryIcon name={category.icon} className="h-7 w-7" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="flex items-center gap-1 font-display text-lg font-semibold text-foreground">
          {name}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </h3>
        {description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {category._count && (
        <span className={cn('mt-auto text-xs font-semibold', a.text)}>{category._count.products}</span>
      )}
    </Link>
  );
}
