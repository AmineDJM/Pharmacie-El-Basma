/** Order status metadata shared across the admin order screens. */
export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

interface StatusMeta {
  label: string;
  /** Badge background/text classes. */
  className: string;
  /** Small status dot colour. */
  dot: string;
}

export const ORDER_STATUS_META: Record<string, StatusMeta> = {
  pending: {
    label: 'Reçue',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  confirmed: {
    label: 'Confirmée',
    className: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  shipped: {
    label: 'Envoyée',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Annulée',
    className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
};

export function orderStatusMeta(status: string): StatusMeta {
  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;
}
