import Link from 'next/link';
import { Pencil, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { AdminPageHeader } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/admin/form-actions';
import { deleteAdminUser } from '@/lib/actions/admin';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const [users, me] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } }).catch(() => []),
    getCurrentUser(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Administrateurs"
        description="Gérez les comptes qui peuvent accéder à cet espace."
        action={{ label: '+ Ajouter un administrateur', href: '/admin/utilisateurs/nouveau' }}
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4 font-semibold">Nom</th>
              <th className="p-4 font-semibold">E-mail</th>
              <th className="p-4 font-semibold">Rôle</th>
              <th className="p-4 font-semibold">Créé le</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const isSelf = me?.sub === u.id;
              return (
                <tr key={u.id} className="transition-colors hover:bg-accent/40">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary dark:bg-primary-100">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-foreground">{u.name}</span>
                      {isSelf && <Badge variant="soft">vous</Badge>}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      {u.role === 'editor' ? 'Éditeur' : 'Administrateur'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/utilisateurs/${u.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Modifier ${u.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {!isSelf && users.length > 1 && (
                        <DeleteButton action={deleteAdminUser} id={u.id} compact message="Supprimer ce compte administrateur ?" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Astuce : pour changer votre mot de passe, modifiez votre propre compte et saisissez un nouveau mot de passe.
      </p>
    </div>
  );
}
