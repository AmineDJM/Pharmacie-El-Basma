import { AdminPageHeader } from '@/components/admin/ui';
import { FaqForm } from '@/components/admin/forms/faq-form';

export default function NewFaqPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouvelle question" description="Ajoutez une question fréquente." />
      <FaqForm />
    </div>
  );
}
