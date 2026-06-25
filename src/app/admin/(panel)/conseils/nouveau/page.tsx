import { AdminPageHeader } from '@/components/admin/ui';
import { ArticleForm } from '@/components/admin/forms/article-form';

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouvel article" description="Rédigez un conseil santé." />
      <ArticleForm />
    </div>
  );
}
