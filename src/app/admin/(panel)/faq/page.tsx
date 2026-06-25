import Link from 'next/link';
import { Pencil, HelpCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { Badge } from '@/components/ui/badge';
import { deleteFaq } from '@/lib/actions/admin';

export default async function AdminFaqPage() {
  const list = await prisma.faq
    .findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="FAQ"
        description={`${list.length} question${list.length > 1 ? 's' : ''} fréquente${list.length > 1 ? 's' : ''}.`}
        action={{ label: '+ Ajouter une question', href: '/admin/faq/nouveau' }}
      />

      {list.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <HelpCircle className="h-8 w-8" />
            <p>Aucune question. Commencez par en ajouter une.</p>
            <Link href="/admin/faq/nouveau" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Ajouter une question
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Question</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((f) => (
                <tr key={f.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <p className="max-w-md truncate font-medium text-foreground">{f.question}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{f.category}</td>
                  <td className="p-4">
                    {f.published ? <Badge variant="soft">Publié</Badge> : <Badge variant="outline">Masqué</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/faq/${f.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${f.question}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteFaq} id={f.id} compact />
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
