'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { storedToCard } from '@/lib/types';

export function FavoritesView() {
  const t = useT();
  const { favorites, ready } = useStore();

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-3xl bg-muted" />;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t('favorites.empty')}
        description={t('favorites.emptyText')}
      >
        <Link href="/produits" className={buttonVariants()}>
          {t('favorites.discover')}
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{favorites.length}</span> produit
          {favorites.length > 1 ? 's' : ''} en favori{favorites.length > 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((p) => (
          <ProductCard key={p.id} product={storedToCard(p)} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Astuce : cliquez sur le <Heart className="inline h-3.5 w-3.5 fill-rose-500 text-rose-500" /> d’un produit pour le retirer de vos favoris.
      </p>
    </div>
  );
}
