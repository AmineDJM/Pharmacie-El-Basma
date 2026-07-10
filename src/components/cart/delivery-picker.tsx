'use client';

import { useEffect } from 'react';
import { Truck, Store, MapPin, Check } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { cn, formatPrice } from '@/lib/utils';
import type { DeliveryOptionData } from '@/lib/types';

/** Find the currently selected option (or the first, as a fallback). */
export function resolveDelivery(options: DeliveryOptionData[], id: string | null) {
  return options.find((o) => o.id === id) ?? null;
}

function groupIcon(group: string | null) {
  const g = (group ?? '').toLowerCase();
  if (g.includes('retrait') || g.includes('magasin')) return Store;
  if (g.includes('relais') || g.includes('point')) return MapPin;
  return Truck;
}

export function DeliveryPicker({ options }: { options: DeliveryOptionData[] }) {
  const t = useT();
  const { deliveryOptionId, setDeliveryOption } = useStore();

  // Auto-select the first option if nothing valid is selected yet.
  useEffect(() => {
    if (options.length === 0) return;
    if (!options.some((o) => o.id === deliveryOptionId)) {
      setDeliveryOption(options[0].id);
    }
  }, [options, deliveryOptionId, setDeliveryOption]);

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('cart.noShipping')}</p>;
  }

  // Preserve incoming order while grouping by carrier.
  const groups: { name: string | null; items: DeliveryOptionData[] }[] = [];
  for (const opt of options) {
    const g = opt.groupName ?? null;
    const last = groups[groups.length - 1];
    if (last && last.name === g) last.items.push(opt);
    else groups.push({ name: g, items: [opt] });
  }

  return (
    <div className="flex flex-col gap-4" role="radiogroup" aria-label={t('cart.shippingTitle')}>
      {groups.map((group) => {
        const Icon = groupIcon(group.name);
        return (
          <div key={group.name ?? 'autre'}>
            {group.name && (
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5" /> {group.name}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {group.items.map((opt) => {
                const selected = opt.id === deliveryOptionId;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors',
                      selected ? 'border-primary bg-primary-50 dark:bg-primary-100' : 'border-border bg-card hover:border-primary/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="deliveryOptionChoice"
                      value={opt.id}
                      checked={selected}
                      onChange={() => setDeliveryOption(opt.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-medium text-foreground">{opt.name}</span>
                      {opt.description && <span className="block text-xs text-muted-foreground">{opt.description}</span>}
                    </span>
                    <span className={cn('shrink-0 font-semibold tabular-nums', opt.price === 0 ? 'text-primary' : 'text-foreground')}>
                      {opt.price === 0 ? t('cart.free') : formatPrice(opt.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
