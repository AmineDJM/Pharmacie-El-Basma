import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AdminPageHeader } from '@/components/admin/ui';
import { AdminUserForm } from '@/components/admin/forms/admin-user-form';

type Params = Promise<{ id: string }>;

export default async function EditAdminUserPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await prisma.adminUser.findUnique({ where: { id } }).catch(() => null);
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Modifier le compte" description={user.email} />
      <AdminUserForm user={{ id: user.id, email: user.email, name: user.name, role: user.role }} />
    </div>
  );
}
