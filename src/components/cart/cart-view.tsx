'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { ProductVisual } from '@/components/ui/product-visual';
import { DeliveryPicker, resolveDelivery } from '@/components/cart/delivery-picker';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { formatPrice } from '@/lib/utils';
import type { DeliveryOptionData } from '@/lib/types';

export function CartView({ deliveryOptions }: { deliveryOptions: DeliveryOptionData[] }) {
  const t = useT();
  const { cart, cartTotal, cartCount, setCartQuantity, removeFromCart, clearCart, deliveryOptionId, ready } = useStore();
  const shipping = resolveDelivery(deliveryOptions, deliveryOptionId);
  const fee = shipping?.price ?? 0;
  const grandTotal = cartTotal + fee;

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-3xl border border-border bg-card" aria-hidden />;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-100">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h2 className="font-display text-xl font-bold text-foreground">{t('cart.empty')}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t('cart.emptyText')}</p>
        <Link
          href="/produits"
          className="mt-1 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
        >
          {t('cart.browse')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items */}
      <div className="space-y-4 lg:col-span-2">
        <ul className="flex flex-col gap-3">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/produits/${item.slug}`}
                className="shrink-0 overflow-hidden rounded-xl border border-border"
                aria-label={item.name}
              >
                <ProductVisual name={item.name} accent={item.accent} imageUrl={item.imageUrl} className="h-24 w-24" sizes="96px" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/produits/${item.slug}`} className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary">
                  {item.name}
                </Link>
                {item.brandName && <p className="text-xs text-muted-foreground">{item.brandName}</p>}
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('cart.unitPrice')} : <span className="font-medium text-foreground">{formatPrice(item.price)}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                <div className="inline-flex h-10 items-center rounded-xl border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setCartQuantity(item.id, item.quantity - 1)}
                    aria-label={t('cart.decrease')}
                    className="flex h-full w-9 items-center justify-center text-foreground transition-colors hover:text-primary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setCartQuantity(item.id, item.quantity + 1)}
                    aria-label={t('cart.increase')}
                    className="flex h-full w-9 items-center justify-center text-foreground transition-colors hover:text-primary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={t('cart.remove')}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Delivery method */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Truck className="h-5 w-5 text-primary" /> {t('cart.shippingTitle')}
          </h2>
          <DeliveryPicker options={deliveryOptions} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/produits" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            ← {t('cart.continue')}
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" /> {t('cart.clear')}
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">{t('cart.summary')}</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t('cart.subtotal')} ({cartCount})</dt>
              <dd className="font-medium text-foreground tabular-nums">{formatPrice(cartTotal)}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">{t('cart.delivery')}</dt>
              <dd className="text-right">
                {shipping ? (
                  <>
                    <span className="font-medium text-foreground tabular-nums">{fee === 0 ? t('cart.free') : formatPrice(fee)}</span>
                    <span className="block text-xs text-muted-foreground">{shipping.name}</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">{t('cart.selectShipping')}</span>
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">{t('cart.total')}</span>
            <span className="text-xl font-bold text-foreground tabular-nums">{formatPrice(grandTotal)}</span>
          </div>
          <Link
            href="/commander"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-600 hover:shadow-glow"
          >
            {t('cart.checkout')} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t('checkout.paymentNote')}</p>
        </div>
      </aside>
    </div>
  );
}
