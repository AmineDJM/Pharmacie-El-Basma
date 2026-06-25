import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { FaqForm } from '@/components/admin/forms/faq-form';
import { prisma } from '@/lib/db';

type Params = Promise<{ id: string }>;

export default async function EditFaqPage({ params }: { params: Params }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } }).catch(() => null);
  if (!faq) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier la question" description={faq.question} />
      <FaqForm faq={faq} />
    </div>
  );
}
