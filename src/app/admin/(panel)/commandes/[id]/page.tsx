import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  User,
  type LucideIcon,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { ProductVisual } from '@/components/ui/product-visual';
import { updateOrderStatus, deleteOrder } from '@/lib/actions/admin';
import { orderStatusMeta } from '@/lib/orders';
import { formatPrice, formatDate, cn } from '@/lib/utils';

export const metadata = { title: 'Détail de la commande' };

/** A status-changing button bound to the updateOrderStatus server action. */
function StatusButton({
  id,
  status,
  label,
  icon: Icon,
  tone,
}: {
  id: string;
  status: string;
  label: string;
  icon: LucideIcon;
  tone: 'primary' | 'success' | 'danger' | 'muted';
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'border border-rose-200 bg-card text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30',
    muted: 'border border-border bg-card text-foreground hover:bg-accent',
  };
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={cn('inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors', tones[tone])}
      >
        <Icon className="h-4 w-4" /> {label}
      </button>
    </form>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order
    .findUnique({ where: { id }, include: { items: true } })
    .catch(() => null);
  if (!order) notFound();

  const meta = orderStatusMeta(order.status);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/commandes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour aux commandes
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Reçue le {formatDate(order.createdAt)}</p>
          </div>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold', meta.className)}>
            <span className={cn('h-2 w-2 rounded-full', meta.dot)} />
            {meta.label}
          </span>
        </div>
      </div>

      {/* Status actions */}
      <AdminCard title="Traiter la commande" description="Confirmez la commande, marquez-la comme envoyée, ou annulez-la.">
        <div className="flex flex-wrap gap-3">
          {order.status === 'pending' && (
            <StatusButton id={order.id} status="confirmed" label="Confirmer la commande" icon={CheckCircle2} tone="primary" />
          )}
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <StatusButton id={order.id} status="shipped" label="Marquer comme envoyée" icon={Truck} tone="success" />
          )}
          {order.status !== 'cancelled' && (
            <StatusButton id={order.id} status="cancelled" label="Annuler la commande" icon={XCircle} tone="danger" />
          )}
          {(order.status === 'cancelled' || order.status === 'shipped') && (
            <StatusButton id={order.id} status="pending" label="Rouvrir la commande" icon={RotateCcw} tone="muted" />
          )}
        </div>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <AdminCard title="Articles commandés">
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="shrink-0 overflow-hidden rounded-lg border border-border">
                    <ProductVisual name={item.name} imageUrl={item.imageUrl} className="h-14 w-14" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.slug ? (
                      <Link href={`/produits/${item.slug}`} target="_blank" className="font-medium text-foreground hover:text-primary">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{item.name}</span>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-foreground tabular-nums">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Sous-total ({order.itemCount} article{order.itemCount > 1 ? 's' : ''})</dt>
                <dd className="font-medium text-foreground tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Livraison</dt>
                <dd className="text-foreground tabular-nums">{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'À convenir'}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="text-lg font-bold text-foreground tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </AdminCard>
        </div>

        {/* Customer */}
        <div className="space-y-6">
          <AdminCard title="Client & livraison">
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2.5 font-medium text-foreground">
                <User className="h-4 w-4 shrink-0 text-muted-foreground" /> {order.customerName}
              </p>
              <a href={`tel:${order.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2.5 text-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" /> {order.phone}
              </a>
              {order.email && (
                <a href={`mailto:${order.email}`} className="flex items-center gap-2.5 break-all text-foreground transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" /> {order.email}
                </a>
              )}
              <p className="flex items-start gap-2.5 text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {order.address}
                  <br />
                  {order.city}, {order.wilaya}
                </span>
              </p>
              {order.notes && (
                <p className="flex items-start gap-2.5 rounded-lg bg-secondary/50 p-3 text-muted-foreground">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0" /> {order.notes}
                </p>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Zone de danger">
            <p className="mb-3 text-sm text-muted-foreground">Supprimer définitivement cette commande de l’historique.</p>
            <DeleteButton action={deleteOrder} id={order.id} label="Supprimer la commande" message="Supprimer définitivement cette commande ? Cette action est irréversible." />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
