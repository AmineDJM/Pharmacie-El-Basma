import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AdminShell } from '@/components/admin/admin-shell';
import { logoutAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  let unread = 0;
  try {
    unread = await prisma.contactMessage.count({ where: { read: false } });
  } catch {
    /* db unavailable */
  }

  return (
    <AdminShell user={{ name: user.name, email: user.email }} unread={unread} logout={logoutAction}>
      {children}
    </AdminShell>
  );
}
