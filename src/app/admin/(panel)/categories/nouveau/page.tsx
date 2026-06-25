import { AdminPageHeader } from '@/components/admin/ui';
import { CategoryForm } from '@/components/admin/forms/category-form';
import { getCategoryTree } from '@/lib/data';

export default async function NewCategoryPage() {
  const tree = await getCategoryTree();
  const parents = tree.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouvelle catégorie" description="Ajoutez une catégorie au catalogue." />
      <CategoryForm parents={parents} />
    </div>
  );
}
