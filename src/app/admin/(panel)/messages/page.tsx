import { Mail, MailOpen, Phone, MessageCircle, Inbox } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { DeleteButton, InlineActionButton } from '@/components/admin/form-actions';
import { toggleMessageRead, deleteMessage } from '@/lib/actions/admin';
import { formatDate, whatsappLink, telLink } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: 'desc' } })
    .catch(() => []);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <AdminPageHeader
        title="Messages de contact"
        description={`${messages.length} message${messages.length > 1 ? 's' : ''} · ${unread} non lu${unread > 1 ? 's' : ''}.`}
      />

      {messages.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p>Aucun message reçu pour le moment.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className={cn(
                'rounded-2xl border bg-card p-5 transition-colors',
                m.read ? 'border-border' : 'border-primary/40 bg-primary-50/40 dark:bg-primary-50/5',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    <h2 className="font-semibold text-foreground">{m.subject}</h2>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {m.name} · <a href={`mailto:${m.email}`} className="hover:text-primary">{m.email}</a>
                    {m.phone && <> · {m.phone}</>}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent">
                  <Mail className="h-4 w-4" /> Répondre
                </a>
                {m.phone && (
                  <>
                    <a href={telLink(m.phone)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent">
                      <Phone className="h-4 w-4" /> Appeler
                    </a>
                    <a href={whatsappLink(m.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                    </a>
                  </>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <InlineActionButton
                    action={toggleMessageRead}
                    fields={{ id: m.id, read: String(m.read) }}
                    title={m.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </InlineActionButton>
                  <DeleteButton action={deleteMessage} id={m.id} compact message="Supprimer ce message ?" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
