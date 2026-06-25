import { AdminPageHeader } from '@/components/admin/ui';
import { ReviewForm } from '@/components/admin/forms/review-form';

export default function NewReviewPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouvel avis" description="Ajoutez un avis client." />
      <ReviewForm />
    </div>
  );
}
