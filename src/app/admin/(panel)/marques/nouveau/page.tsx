import { AdminPageHeader } from '@/components/admin/ui';
import { BrandForm } from '@/components/admin/forms/brand-form';

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouvelle marque" description="Ajoutez une marque partenaire." />
      <BrandForm />
    </div>
  );
}
