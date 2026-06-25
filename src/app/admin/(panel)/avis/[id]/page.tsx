import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { ReviewForm } from '@/components/admin/forms/review-form';
import { prisma } from '@/lib/db';

type Params = Promise<{ id: string }>;

export default async function EditReviewPage({ params }: { params: Params }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } }).catch(() => null);
  if (!review) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier l’avis" description={review.author} />
      <ReviewForm review={review} />
    </div>
  );
}
