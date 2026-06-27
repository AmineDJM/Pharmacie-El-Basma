'use client';

import Link from 'next/link';
import { Heart, Scale, Check } from 'lucide-react';
import { ProductVisual } from '@/components/ui/product-visual';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { useStore } from '@/components/providers/store-provider';
import { useLocale, useT } from '@/i18n/provider';
import { tField } from '@/lib/localize';
import { cn, formatPrice, discountPercent } from '@/lib/utils';
import { cardToStored, type ProductCardData } from '@/lib/types';

export function ProductCard({
  product,
  priority,
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
}) {
  const { toggleFavorite, isFavorite, toggleCompare, isComparing } = useStore();
  const locale = useLocale();
  const t = useT();
  const fav = isFavorite(product.id);
  const cmp = isComparing(product.id);
  const stored = cardToStored(product);
  const promo = discountPercent(product.price, product.oldPrice);
  const name = tField({ translations: product.translations }, locale, 'name', product.name);
  const categoryLabel = product.categoryName
    ? tField({ translations: product.categoryTranslations }, locale, 'name', product.categoryName)
    : null;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/produits/${product.slug}`} aria-label={name} className="block h-full w-full">
          <ProductVisual
            name={product.name}
            accent={product.accent}
            imageUrl={product.imageUrl}
            brandName={product.brandName}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {promo && <Badge variant="promo">−{promo}%</Badge>}
          {product.isNew && <Badge variant="new">{t('card.new')}</Badge>}
          {product.isBestSeller && !promo && <Badge variant="best">{t('card.best')}</Badge>}
          {product.isBio && <Badge variant="soft">{t('card.bio')}</Badge>}
          {!product.inStock && <Badge variant="outline" className="bg-card/90">{t('card.onOrder')}</Badge>}
        </div>

        {/* Quick actions */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleFavorite(stored)}
            aria-pressed={fav}
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur transition-colors hover:text-rose-500"
          >
            <Heart className={cn('h-[1.05rem] w-[1.05rem]', fav && 'fill-rose-500 text-rose-500')} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(stored)}
            aria-pressed={cmp}
            aria-label={cmp ? 'Retirer du comparateur' : 'Ajouter au comparateur'}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:text-primary',
              cmp ? 'text-primary' : 'text-foreground',
            )}
          >
            {cmp ? <Check className="h-[1.05rem] w-[1.05rem]" /> : <Scale className="h-[1.05rem] w-[1.05rem]" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {categoryLabel && (
          <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-primary/80">
            {categoryLabel}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          <Link href={`/produits/${product.slug}`} className="transition-colors hover:text-primary">
            {name}
          </Link>
        </h3>
        {product.brandName && (
          <p className="text-xs text-muted-foreground">{product.brandName}</p>
        )}
        <div className="mt-0.5">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          </div>
          <Link
            href={`/produits/${product.slug}`}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t('common.details')}
          </Link>
        </div>
      </div>
    </article>
  );
}
