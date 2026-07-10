import Link from 'next/link';
import { Pencil, Truck } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteDeliveryOption } from '@/lib/actions/admin';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Modes de livraison' };

export default async function AdminDeliveryPage() {
  const list = await prisma.deliveryOption
    .findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Modes de livraison"
        description={`${list.length} mode${list.length > 1 ? 's' : ''} de livraison. Le client choisit le sien lors de la commande.`}
        action={{ label: '+ Ajouter un mode', href: '/admin/livraison/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Truck className="h-8 w-8" />
            <p>Aucun mode de livraison. Ajoutez-en un pour permettre les commandes.</p>
            <Link href="/admin/livraison/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter un mode
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Mode</th>
                <th className="p-4 font-semibold">Transporteur</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{o.name}</p>
                    {o.description && <p className="text-xs text-muted-foreground">{o.description}</p>}
                  </td>
                  <td className="p-4 text-muted-foreground">{o.groupName ?? '—'}</td>
                  <td className="p-4 font-semibold text-foreground">{o.price === 0 ? 'Gratuit' : formatPrice(o.price)}</td>
                  <td className="p-4">
                    {o.active ? <Badge variant="soft">Actif</Badge> : <Badge variant="outline">Masqué</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/livraison/${o.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${o.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteDeliveryOption} id={o.id} compact />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
