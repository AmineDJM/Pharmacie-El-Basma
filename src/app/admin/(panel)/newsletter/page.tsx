import { Download, Send } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/form-actions';
import { CopyEmails } from '@/components/admin/copy-emails';
import { deleteSubscriber } from '@/lib/actions/admin';
import { formatDate } from '@/lib/utils';

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber
    .findMany({ orderBy: { createdAt: 'desc' } })
    .catch(() => []);

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description={`${subscribers.length} abonné${subscribers.length > 1 ? 's' : ''}.`}
      />

      <div className="mb-5 flex flex-wrap gap-2.5">
        <CopyEmails emails={subscribers.map((s) => s.email)} />
        <a
          href="/api/admin/newsletter/export"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
        >
          <Download className="h-4 w-4" /> Exporter (CSV)
        </a>
      </div>

      {subscribers.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Send className="h-8 w-8" />
            <p>Aucun abonné pour le moment.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">E-mail</th>
                <th className="p-4 font-semibold">Inscrit le</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4 font-medium text-foreground">{s.email}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(s.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <DeleteButton action={deleteSubscriber} id={s.id} compact message="Supprimer cet abonné ?" />
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
