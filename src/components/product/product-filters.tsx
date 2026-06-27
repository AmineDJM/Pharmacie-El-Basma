'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useT } from '@/i18n/provider';
import { cn } from '@/lib/utils';

const SORTS = [
  { value: 'recent', labelKey: 'filters.sortRelevance' },
  { value: 'nouveautes', labelKey: 'filters.sortNew' },
  { value: 'ventes', labelKey: 'filters.sortBest' },
  { value: 'price-asc', labelKey: 'filters.sortPriceAsc' },
  { value: 'price-desc', labelKey: 'filters.sortPriceDesc' },
];

const selectClass =
  'h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

export function ProductFilters({
  categories,
  brands,
  basePath = '/produits',
  showCategory = true,
}: {
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
  basePath?: string;
  showCategory?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('recherche') ?? '');
  const [open, setOpen] = useState(false);

  const apply = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      }
      next.delete('page');
      const qs = next.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
    },
    [params, router, basePath],
  );

  // Debounced search.
  useEffect(() => {
    const current = params.get('recherche') ?? '';
    if (search === current) return;
    const t = setTimeout(() => apply({ recherche: search || null }), 380);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const sort = params.get('tri') ?? 'recent';
  const category = params.get('categorie') ?? '';
  const brand = params.get('marque') ?? '';
  const promo = params.get('promo') === '1';
  const hasFilters = category || brand || promo || (params.get('recherche') ?? '');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('filters.searchCatalog')}
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Rechercher"
          />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium md:hidden"
          aria-expanded={open}
        >
          <SlidersHorizontal className="h-4 w-4" /> {t('filters.filters')}
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <FilterSelects
            categories={categories}
            brands={brands}
            showCategory={showCategory}
            category={category}
            brand={brand}
            promo={promo}
            sort={sort}
            apply={apply}
          />
        </div>

        <label className="ml-auto hidden items-center gap-2 text-sm md:flex">
          <span className="text-muted-foreground">{t('filters.sortBy')}&nbsp;:</span>
          <select value={sort} onChange={(e) => apply({ tri: e.target.value })} className={selectClass} aria-label="Trier">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 md:hidden">
          <FilterSelects
            categories={categories}
            brands={brands}
            showCategory={showCategory}
            category={category}
            brand={brand}
            promo={promo}
            sort={sort}
            apply={apply}
            mobile
          />
        </div>
      )}

      {hasFilters && (
        <button
          onClick={() => {
            setSearch('');
            router.push(basePath, { scroll: false });
          }}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary"
        >
          <X className="h-3.5 w-3.5" /> {t('filters.resetFilters')}
        </button>
      )}
    </div>
  );
}

function FilterSelects({
  categories,
  brands,
  showCategory,
  category,
  brand,
  promo,
  sort,
  apply,
  mobile,
}: {
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
  showCategory: boolean;
  category: string;
  brand: string;
  promo: boolean;
  sort: string;
  apply: (u: Record<string, string | null>) => void;
  mobile?: boolean;
}) {
  const t = useT();
  return (
    <>
      {showCategory && (
        <select value={category} onChange={(e) => apply({ categorie: e.target.value || null })} className={selectClass} aria-label="Catégorie">
          <option value="">{t('filters.allCategories')}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      <select value={brand} onChange={(e) => apply({ marque: e.target.value || null })} className={selectClass} aria-label="Marque">
        <option value="">{t('filters.allBrands')}</option>
        {brands.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
      <label className={cn('inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors', promo ? 'border-primary bg-primary-50 text-primary dark:bg-primary-100' : 'border-border bg-card')}>
        <input type="checkbox" checked={promo} onChange={(e) => apply({ promo: e.target.checked ? '1' : null })} className="accent-primary" />
        {t('filters.onPromo')}
      </label>
      {mobile && (
        <select value={sort} onChange={(e) => apply({ tri: e.target.value })} className={selectClass} aria-label="Trier">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.labelKey)}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
