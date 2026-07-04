import Link from 'next/link';
import { Eye, Inbox, Phone } from 'lucide-react';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { ORDER_STATUSES, orderStatusMeta } from '@/lib/orders';
import { formatPrice, formatDate, cn } from '@/lib/utils';

export const metadata = { title: 'Commandes' };

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'Reçues' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'shipped', label: 'Envoyées' },
  { key: 'cancelled', label: 'Annulées' },
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;
  const active = (ORDER_STATUSES as readonly string[]).includes(statut ?? '') ? statut! : 'all';
  const where: Prisma.OrderWhereInput = active === 'all' ? {} : { status: active };

  let list: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  const counts: Record<string, number> = { all: 0, pending: 0, confirmed: 0, shipped: 0, cancelled: 0 };
  try {
    const [orders, grouped, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 }),
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.order.count(),
    ]);
    list = orders;
    counts.all = total;
    for (const g of grouped) counts[g.status] = g._count._all;
  } catch {
    /* db unavailable */
  }

  return (
    <div>
      <AdminPageHeader
        title="Commandes"
        description={`${counts.all} commande${counts.all > 1 ? 's' : ''} au total. ${counts.pending} en attente de confirmation.`}
      />

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = active === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === 'all' ? '/admin/commandes' : `/admin/commandes?statut=${f.key}`}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors',
                isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground/75 hover:bg-accent',
              )}
            >
              {f.label}
              <span className={cn('rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold', isActive ? 'bg-white/20' : 'bg-secondary text-muted-foreground')}>
                {counts[f.key] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p>Aucune commande {active !== 'all' ? 'dans cette catégorie' : 'pour le moment'}.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Commande</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Articles</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((o) => {
                const meta = orderStatusMeta(o.status);
                return (
                  <tr key={o.id} className="transition-colors hover:bg-accent/40">
                    <td className="p-4">
                      <Link href={`/admin/commandes/${o.id}`} className="font-semibold text-foreground hover:text-primary">
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{o.customerName}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {o.phone}
                      </p>
                    </td>
                    <td className="p-4 text-muted-foreground">{o.itemCount}</td>
                    <td className="p-4 font-semibold text-foreground">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', meta.className)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/commandes/${o.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          <Eye className="h-4 w-4" /> Voir
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
