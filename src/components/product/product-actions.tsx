'use client';

import Link from 'next/link';
import { Heart, Scale, MessageCircle, Phone, Check } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { cn, whatsappLink, telLink } from '@/lib/utils';
import { cardToStored, type ProductCardData } from '@/lib/types';

export function ProductActions({
  product,
  whatsapp,
  phone,
}: {
  product: ProductCardData;
  whatsapp: string;
  phone: string;
}) {
  const t = useT();
  const { toggleFavorite, isFavorite, toggleCompare, isComparing } = useStore();
  const stored = cardToStored(product);
  const fav = isFavorite(product.id);
  const cmp = isComparing(product.id);

  const waMessage = `Bonjour, je souhaite vérifier la disponibilité du produit « ${product.name} »${
    product.brandName ? ` (${product.brandName})` : ''
  }. Merci !`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <a
          href={whatsappLink(whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.01]"
        >
          <MessageCircle className="h-5 w-5" /> {t('product.askAvailability')}
        </a>
        <a
          href={telLink(phone)}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Phone className="h-5 w-5" /> {t('common.call')}
        </a>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={() => toggleFavorite(stored)}
          aria-pressed={fav}
          className={cn(
            'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors',
            fav ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30' : 'border-border bg-card hover:bg-accent',
          )}
        >
          <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
          {fav ? t('product.inFavorites') : t('product.addFavorite')}
        </button>
        <button
          onClick={() => toggleCompare(stored)}
          aria-pressed={cmp}
          className={cn(
            'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors',
            cmp ? 'border-primary bg-primary-50 text-primary dark:bg-primary-100' : 'border-border bg-card hover:bg-accent',
          )}
        >
          {cmp ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
          {cmp ? t('product.inCompare') : t('product.compare')}
        </button>
      </div>

      <Link
        href={`/contact?sujet=disponibilite&produit=${encodeURIComponent(product.name)}`}
        className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        {t('product.formFallback')}
      </Link>
    </div>
  );
}
