'use client';

import { useActionState } from 'react';
import { saveAdminUser } from '@/lib/actions/admin';
import { Field, Input, Select, AdminCard, FormError } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

export function AdminUserForm({
  user,
}: {
  user?: { id: string; email: string; name: string; role: string };
}) {
  const [state, action] = useActionState(saveAdminUser, initial);

  return (
    <form action={action} className="space-y-6">
      {user && <input type="hidden" name="id" value={user.id} />}
      <AdminCard title="Compte administrateur">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom" required>
            <Input name="name" defaultValue={user?.name} required placeholder="Nom et prénom" />
          </Field>
          <Field label="Adresse e-mail" required>
            <Input name="email" type="email" defaultValue={user?.email} required placeholder="email@exemple.dz" />
          </Field>
          <Field label="Rôle">
            <Select name="role" defaultValue={user?.role || 'admin'}>
              <option value="admin">Administrateur</option>
              <option value="editor">Éditeur</option>
            </Select>
          </Field>
          <Field
            label={user ? 'Nouveau mot de passe' : 'Mot de passe'}
            required={!user}
            hint={user ? 'Laissez vide pour conserver le mot de passe actuel.' : '6 caractères minimum.'}
          >
            <Input name="password" type="password" autoComplete="new-password" required={!user} placeholder="••••••••" />
          </Field>
        </div>
      </AdminCard>
      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/utilisateurs" />
      </div>
    </form>
  );
}
