'use client';

import Link from 'next/link';
import { Scale, X, Check, Minus } from 'lucide-react';
import { ProductVisual } from '@/components/ui/product-visual';
import { StarRating } from '@/components/ui/star-rating';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { formatPrice, discountPercent } from '@/lib/utils';

export function CompareView() {
  const t = useT();
  const { compare, ready, removeCompare, clearCompare } = useStore();

  if (!ready) return <div className="h-64 animate-pulse rounded-3xl bg-muted" />;

  if (compare.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title={t('compare.empty')}
        description={t('compare.emptyText')}
      >
        <Link href="/produits" className={buttonVariants()}>
          {t('compare.browse')}
        </Link>
      </EmptyState>
    );
  }

  const lowest = Math.min(...compare.map((p) => p.price));

  const rows: { label: string; render: (p: (typeof compare)[number]) => React.ReactNode }[] = [
    {
      label: t('compare.price'),
      render: (p) => (
        <div className="flex flex-col items-center">
          {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>}
          <span className="font-bold text-foreground">{formatPrice(p.price)}</span>
          {p.price === lowest && compare.length > 1 && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[0.65rem] font-semibold text-primary dark:bg-primary-100">
              <Check className="h-3 w-3" /> {t('compare.cheapest')}
            </span>
          )}
        </div>
      ),
    },
    { label: t('compare.brand'), render: (p) => p.brandName || <Minus className="mx-auto h-4 w-4 text-muted-foreground" /> },
    { label: t('compare.category'), render: (p) => p.categoryName || <Minus className="mx-auto h-4 w-4 text-muted-foreground" /> },
    { label: t('compare.rating'), render: (p) => <div className="flex justify-center"><StarRating rating={p.rating} /></div> },
    {
      label: t('compare.promotion'),
      render: (p) => {
        const d = discountPercent(p.price, p.oldPrice);
        return d ? <span className="font-semibold text-rose-500">−{d}%</span> : <Minus className="mx-auto h-4 w-4 text-muted-foreground" />;
      },
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{compare.length}</span> / 4 produits comparés
        </p>
        <button onClick={clearCompare} className="text-sm font-medium text-primary hover:underline">
          {t('compare.clear')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-32 bg-card p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Comparaison
              </th>
              {compare.map((p) => (
                <th key={p.id} className="border-l border-border p-4 align-top">
                  <div className="relative flex flex-col items-center gap-2">
                    <button
                      onClick={() => removeCompare(p.id)}
                      aria-label={`Retirer ${p.name}`}
                      className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Link href={`/produits/${p.slug}`} className="group flex flex-col items-center gap-2">
                      <ProductVisual name={p.name} accent={p.accent} imageUrl={p.imageUrl} className="h-24 w-24 rounded-xl" sizes="96px" />
                      <span className="line-clamp-2 text-center text-sm font-semibold text-foreground group-hover:text-primary">{p.name}</span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="sticky left-0 z-10 bg-card p-4 text-left font-medium text-muted-foreground">{row.label}</td>
                {compare.map((p) => (
                  <td key={p.id} className="border-l border-border p-4 text-center text-foreground">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="sticky left-0 z-10 bg-card p-4" />
              {compare.map((p) => (
                <td key={p.id} className="border-l border-border p-4 text-center">
                  <Link href={`/produits/${p.slug}`} className={buttonVariants({ size: 'sm' })}>
                    {t('compare.view')}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
