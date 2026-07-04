'use client';

import { useState } from 'react';
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { cn } from '@/lib/utils';
import { cardToStored, type ProductCardData } from '@/lib/types';

/**
 * Add-to-cart control, shared across the catalogue.
 * - `icon`   : round icon button for product-card quick actions
 * - `card`   : small labelled button for card footers
 * - `detail` : quantity stepper + primary button for the product page
 */
export function AddToCartButton({
  product,
  variant = 'card',
  className,
}: {
  product: ProductCardData;
  variant?: 'icon' | 'card' | 'detail';
  className?: string;
}) {
  const t = useT();
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = (n = 1) => {
    addToCart(cardToStored(product), n);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => add(1)}
        aria-label={t('cart.add')}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur transition-colors hover:text-primary',
          added && 'text-primary',
          className,
        )}
      >
        {added ? <Check className="h-[1.05rem] w-[1.05rem]" /> : <ShoppingBag className="h-[1.05rem] w-[1.05rem]" />}
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={() => add(1)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-600',
          className,
        )}
      >
        {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
        {added ? t('cart.added') : t('cart.add')}
      </button>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2.5 sm:flex-row sm:items-stretch', className)}>
      <div className="inline-flex h-13 items-center justify-between rounded-xl border border-border bg-card sm:justify-start">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label={t('cart.decrease')}
          className="flex h-full w-12 items-center justify-center text-foreground transition-colors hover:text-primary"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label={t('cart.increase')}
          className="flex h-full w-12 items-center justify-center text-foreground transition-colors hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => add(qty)}
        className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01]"
      >
        {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        {added ? t('cart.added') : t('cart.add')}
      </button>
    </div>
  );
}
