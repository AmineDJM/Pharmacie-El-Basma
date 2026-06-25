import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** Auth-guarded CSV export of newsletter subscribers. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const subscribers = await prisma.newsletterSubscriber
    .findMany({ orderBy: { createdAt: 'desc' } })
    .catch(() => []);

  const rows = [
    'email,actif,date_inscription',
    ...subscribers.map((s) => `${s.email},${s.active ? 'oui' : 'non'},${s.createdAt.toISOString()}`),
  ];

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter-el-basma.csv"',
    },
  });
}
