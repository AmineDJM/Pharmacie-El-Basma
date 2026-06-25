import Link from 'next/link';
import { Pencil, Tags } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteBrand } from '@/lib/actions/admin';

export default async function AdminBrandsPage() {
  const list = await prisma.brand
    .findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Marques"
        description={`${list.length} marque${list.length > 1 ? 's' : ''} référencée${list.length > 1 ? 's' : ''}.`}
        action={{ label: '+ Ajouter une marque', href: '/admin/marques/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Tags className="h-8 w-8" />
            <p>Aucune marque. Commencez par en ajouter une.</p>
            <Link href="/admin/marques/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter une marque
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Nom</th>
                <th className="p-4 font-semibold">Nb produits</th>
                <th className="p-4 font-semibold">Mise en avant</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <p className="truncate font-medium text-foreground">{b.name}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{b._count.products}</td>
                  <td className="p-4">
                    {b.featured ? <Badge variant="soft">Mise en avant</Badge> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/marques/${b.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${b.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteBrand} id={b.id} compact />
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
