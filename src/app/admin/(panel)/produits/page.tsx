import Link from 'next/link';
import { Pencil, PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { ProductVisual } from '@/components/ui/product-visual';
import { Badge } from '@/components/ui/badge';
import { deleteProduct } from '@/lib/actions/admin';
import { formatPrice, discountPercent } from '@/lib/utils';

export default async function AdminProductsPage() {
  const list = await prisma.product
    .findMany({
      orderBy: { updatedAt: 'desc' },
      include: { category: { select: { name: true, accent: true } }, brand: { select: { name: true } } },
    })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Produits"
        description={`${list.length} produit${list.length > 1 ? 's' : ''} dans le catalogue.`}
        action={{ label: '+ Ajouter un produit', href: '/admin/produits/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <PackageSearch className="h-8 w-8" />
            <p>Aucun produit. Commencez par en ajouter un.</p>
            <Link href="/admin/produits/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter un produit
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Produit</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((p) => {
                const promo = discountPercent(p.price, p.oldPrice);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-accent/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ProductVisual name={p.name} accent={p.category?.accent} imageUrl={p.imageUrl} className="h-11 w-11 shrink-0 rounded-lg" sizes="44px" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{p.name}</p>
                          {p.brand && <p className="text-xs text-muted-foreground">{p.brand.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.category?.name ?? '—'}</td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground">{formatPrice(p.price)}</span>
                      {promo && <span className="ml-1 text-xs text-rose-500">−{promo}%</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {!p.inStock && <Badge variant="outline">Sur commande</Badge>}
                        {p.isFeatured && <Badge variant="soft">Mis en avant</Badge>}
                        {p.isNew && <Badge variant="new">Nouveau</Badge>}
                        {p.isBestSeller && <Badge variant="best">Top</Badge>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produits/${p.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label={`Modifier ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton action={deleteProduct} id={p.id} compact />
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
