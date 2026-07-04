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
  let pendingOrders = 0;
  try {
    [unread, pendingOrders] = await Promise.all([
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);
  } catch {
    /* db unavailable */
  }

  return (
    <AdminShell user={{ name: user.name, email: user.email }} unread={unread} pendingOrders={pendingOrders} logout={logoutAction}>
      {children}
    </AdminShell>
  );
}
