'use client';

import { useEffect } from 'react';
import { ProductCard } from './product-card';
import { useStore } from '@/components/providers/store-provider';
import { SectionHeading } from '@/components/ui/section-heading';
import type { StoredProduct } from '@/lib/types';

/** Records a product view (drop on a product detail page). */
export function TrackRecentlyViewed({ product }: { product: StoredProduct }) {
  const { addRecentlyViewed } = useStore();
  useEffect(() => {
    addRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  return null;
}

/** Displays recently viewed products (excluding the current one). */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { recentlyViewed, ready } = useStore();
  const items = recentlyViewed.filter((p) => p.id !== excludeId);
  if (!ready || items.length === 0) return null;

  return (
    <section className="section pt-0">
      <div className="container">
        <SectionHeading eyebrow="Votre historique" title="Récemment consultés" align="left" className="mb-8" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.slice(0, 5).map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                oldPrice: p.oldPrice ?? null,
                shortDescription: p.shortDescription,
                rating: p.rating,
                reviewCount: 0,
                isNew: false,
                isBestSeller: false,
                inStock: true,
                imageUrl: p.imageUrl ?? null,
                brandName: p.brandName ?? null,
                categoryName: p.categoryName ?? null,
                categorySlug: null,
                accent: p.accent,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
