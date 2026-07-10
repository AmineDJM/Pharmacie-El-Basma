'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { CheckCircle2, Loader2, ShoppingBag, Lock, MessageCircle, ArrowRight, Truck } from 'lucide-react';
import { placeOrder, type FormState } from '@/lib/actions/public';
import { useStore } from '@/components/providers/store-provider';
import { DeliveryPicker, resolveDelivery } from '@/components/cart/delivery-picker';
import { useT } from '@/i18n/provider';
import { cn, formatPrice, whatsappLink, telLink } from '@/lib/utils';
import type { DeliveryOptionData } from '@/lib/types';

const initial: FormState = { ok: false, message: '' };

// Wilayas fréquentes pour la livraison (saisie libre possible via la datalist).
const WILAYAS = [
  'Blida', 'Alger', 'Tipaza', 'Boumerdès', 'Médéa', 'Aïn Defla', 'Bouira', 'Tizi Ouzou',
  'Chlef', 'Djelfa', 'Béjaïa', 'Sétif', 'Constantine', 'Oran', 'Annaba',
];

const inputClass =
  'h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-600 hover:shadow-glow disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
      {label}
    </button>
  );
}

function LabeledField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm', className)}>
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}

export function CheckoutForm({
  whatsapp,
  phone,
  deliveryOptions,
}: {
  whatsapp: string;
  phone: string;
  deliveryOptions: DeliveryOptionData[];
}) {
  const t = useT();
  const { cart, cartTotal, cartCount, clearCart, deliveryOptionId, ready } = useStore();
  const [state, formAction] = useActionState(placeOrder, initial);
  const [confirmed, setConfirmed] = useState<{ orderNumber: string; summary: string } | null>(null);

  const shipping = resolveDelivery(deliveryOptions, deliveryOptionId);
  const fee = shipping?.price ?? 0;
  const grandTotal = cartTotal + fee;

  // On success: snapshot the order for the confirmation screen, then empty the cart.
  useEffect(() => {
    if (state.ok && state.orderNumber && !confirmed) {
      const lines = cart.map((i) => `• ${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`);
      if (shipping) lines.push(`${t('cart.delivery')} : ${shipping.name} — ${fee === 0 ? t('cart.free') : formatPrice(fee)}`);
      setConfirmed({ orderNumber: state.orderNumber, summary: lines.join('\n') });
      clearCart();
    }
  }, [state.ok, state.orderNumber, confirmed, cart, clearCart, shipping, fee, t]);

  // --- Confirmation ---------------------------------------------------------
  if (confirmed) {
    const waMessage = `Bonjour, je viens de passer la commande ${confirmed.orderNumber} sur votre site.\n\n${confirmed.summary}`;
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-primary/20 bg-primary-50 p-8 text-center dark:bg-primary-100">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold text-primary-900">{t('order.confirmedTitle')}</h2>
          <p className="mt-2 text-sm text-primary-900/80">{t('order.confirmedText')}</p>
        </div>
        <div className="w-full rounded-2xl border border-primary/20 bg-card px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('order.number')}</p>
          <p className="mt-1 font-display text-xl font-bold text-foreground">{confirmed.orderNumber}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row">
          <a
            href={whatsappLink(whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
          >
            <MessageCircle className="h-5 w-5" /> {t('order.whatsappBackup')}
          </a>
          <Link
            href="/produits"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            {t('order.continue')}
          </Link>
        </div>
      </div>
    );
  }

  // --- Empty cart -----------------------------------------------------------
  if (ready && cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-16 text-center">
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

  const itemsPayload = JSON.stringify(
    cart.map((i) => ({ id: i.id, quantity: i.quantity, name: i.name, price: i.price, slug: i.slug, imageUrl: i.imageUrl })),
  );

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3">
      <input type="hidden" name="items" value={itemsPayload} />
      <input type="hidden" name="deliveryOptionId" value={deliveryOptionId ?? ''} />
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {/* Fields */}
      <div className="space-y-6 lg:col-span-2">
        <fieldset className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <legend className="px-1 font-display text-lg font-semibold text-foreground">{t('checkout.contact')}</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <LabeledField label={`${t('checkout.name')} *`} error={state.errors?.name} className="sm:col-span-2">
              <input name="name" required autoComplete="name" placeholder="Ex : Amine Benali" className={inputClass} />
            </LabeledField>
            <LabeledField label={`${t('checkout.phone')} *`} error={state.errors?.phone}>
              <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="0X XX XX XX XX" className={inputClass} />
            </LabeledField>
            <LabeledField label={t('checkout.email')} error={state.errors?.email}>
              <input name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" className={inputClass} />
            </LabeledField>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <legend className="px-1 font-display text-lg font-semibold text-foreground">{t('checkout.delivery')}</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <LabeledField label={`${t('checkout.wilaya')} *`} error={state.errors?.wilaya}>
              <input name="wilaya" required list="wilayas" defaultValue="Blida" placeholder="Blida" className={inputClass} />
              <datalist id="wilayas">
                {WILAYAS.map((w) => (
                  <option key={w} value={w} />
                ))}
              </datalist>
            </LabeledField>
            <LabeledField label={`${t('checkout.city')} *`} error={state.errors?.city}>
              <input name="city" required defaultValue="Boufarik" placeholder="Boufarik" className={inputClass} />
            </LabeledField>
            <LabeledField label={`${t('checkout.address')} *`} error={state.errors?.address} className="sm:col-span-2">
              <textarea
                name="address"
                required
                rows={2}
                placeholder="Cité, rue, n° de bâtiment, point de repère…"
                className={cn(inputClass, 'h-auto resize-y py-3')}
              />
            </LabeledField>
            <LabeledField label={t('checkout.notes')} error={state.errors?.notes} className="sm:col-span-2">
              <textarea
                name="notes"
                rows={2}
                placeholder={t('checkout.notesPlaceholder')}
                className={cn(inputClass, 'h-auto resize-y py-3')}
              />
            </LabeledField>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <legend className="flex items-center gap-2 px-1 font-display text-lg font-semibold text-foreground">
            <Truck className="h-5 w-5 text-primary" /> {t('cart.shippingTitle')}
          </legend>
          <div className="mt-3">
            <DeliveryPicker options={deliveryOptions} />
          </div>
        </fieldset>

        {!state.ok && state.message && (
          <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:bg-rose-950/40">{state.message}</p>
        )}
      </div>

      {/* Order summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">{t('checkout.summary')}</h2>
          <ul className="mt-4 divide-y divide-border">
            {cart.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="line-clamp-2 font-medium text-foreground">{i.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatPrice(i.price)} × {i.quantity}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-foreground tabular-nums">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('cart.subtotal')} ({cartCount})</span>
              <span className="font-medium text-foreground tabular-nums">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">{t('cart.delivery')}</span>
              <span className="text-right">
                {shipping ? (
                  <>
                    <span className="font-medium text-foreground tabular-nums">{fee === 0 ? t('cart.free') : formatPrice(fee)}</span>
                    <span className="block text-xs text-muted-foreground">{shipping.name}</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">{t('cart.selectShipping')}</span>
                )}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold text-foreground">{t('cart.total')}</span>
            <span className="text-xl font-bold text-foreground tabular-nums">{formatPrice(grandTotal)}</span>
          </div>

          <div className="mt-5">
            <SubmitButton label={t('checkout.placeOrder')} />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> {t('checkout.paymentNote')}
          </p>
          <Link href="/panier" className="mt-3 block text-center text-sm font-medium text-primary underline-offset-4 hover:underline">
            ← {t('checkout.backToCart')}
          </Link>
          <a href={telLink(phone)} className="mt-2 block text-center text-xs text-muted-foreground hover:text-primary">
            {t('checkout.needHelp')}
          </a>
        </div>
      </aside>
    </form>
  );
}
