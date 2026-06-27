import { AdminPageHeader } from '@/components/admin/ui';
import { AdminUserForm } from '@/components/admin/forms/admin-user-form';

export default function NewAdminUserPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Nouvel administrateur" description="Créez un compte d’accès à l’espace d’administration." />
      <AdminUserForm />
    </div>
  );
}
