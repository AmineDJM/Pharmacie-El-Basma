import Link from 'next/link';
import { Pencil, MessageSquareQuote } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteReview } from '@/lib/actions/admin';

export default async function AdminReviewsPage() {
  const list = await prisma.review
    .findMany({ orderBy: { createdAt: 'desc' } })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Avis"
        description={`${list.length} avis client${list.length > 1 ? 's' : ''}.`}
        action={{ label: '+ Ajouter un avis', href: '/admin/avis/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <MessageSquareQuote className="h-8 w-8" />
            <p>Aucun avis. Commencez par en ajouter un.</p>
            <Link href="/admin/avis/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter un avis
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Auteur</th>
                <th className="p-4 font-semibold">Note</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{r.author}</p>
                      <p className="text-xs text-muted-foreground">{r.location}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-amber-500">★ {r.rating}/5</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.source}</td>
                  <td className="p-4">
                    {r.approved ? <Badge variant="soft">Approuvé</Badge> : <Badge variant="outline">En attente</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/avis/${r.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier l’avis de ${r.author}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteReview} id={r.id} compact />
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
