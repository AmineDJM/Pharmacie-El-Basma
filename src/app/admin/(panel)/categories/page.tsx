import Link from 'next/link';
import { Pencil, FolderTree } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteCategory } from '@/lib/actions/admin';

export default async function AdminCategoriesPage() {
  const list = await prisma.category
    .findMany({
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
      include: { parent: { select: { name: true } }, _count: { select: { products: true } } },
    })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Catégories"
        description={`${list.length} catégorie${list.length > 1 ? 's' : ''} dans le catalogue.`}
        action={{ label: '+ Ajouter une catégorie', href: '/admin/categories/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <FolderTree className="h-8 w-8" />
            <p>Aucune catégorie. Commencez par en ajouter une.</p>
            <Link href="/admin/categories/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter une catégorie
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Nom</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Nb produits</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{c.name}</p>
                      {c.parent && <p className="text-xs text-muted-foreground">{c.parent.name}</p>}
                    </div>
                  </td>
                  <td className="p-4">
                    {c.parentId ? (
                      <Badge variant="outline">Sous-catégorie</Badge>
                    ) : (
                      <Badge variant="soft">Principale</Badge>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{c._count.products}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${c.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteCategory} id={c.id} compact />
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
