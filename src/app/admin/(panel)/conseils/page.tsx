import Link from 'next/link';
import { Pencil, Newspaper } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteArticle } from '@/lib/actions/admin';
import { formatDate } from '@/lib/utils';

export default async function AdminArticlesPage() {
  const list = await prisma.article
    .findMany({ orderBy: { publishedAt: 'desc' } })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Conseils"
        description={`${list.length} article${list.length > 1 ? 's' : ''} rédigé${list.length > 1 ? 's' : ''}.`}
        action={{ label: '+ Ajouter un article', href: '/admin/conseils/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Newspaper className="h-8 w-8" />
            <p>Aucun article. Commencez par en rédiger un.</p>
            <Link href="/admin/conseils/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter un article
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.category}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {a.published ? <Badge variant="soft">Publié</Badge> : <Badge variant="outline">Brouillon</Badge>}
                      {a.featured && <Badge variant="best">À la une</Badge>}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(a.publishedAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/conseils/${a.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${a.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteArticle} id={a.id} compact />
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
