import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { CategoryForm } from '@/components/admin/forms/category-form';
import { prisma } from '@/lib/db';
import { getCategoryTree } from '@/lib/data';

type Params = Promise<{ id: string }>;

export default async function EditCategoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const [category, tree] = await Promise.all([
    prisma.category.findUnique({ where: { id } }).catch(() => null),
    getCategoryTree(),
  ]);
  if (!category) notFound();

  const parents = tree.filter((c) => c.id !== id).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier la catégorie" description={category.name} />
      <CategoryForm category={category} parents={parents} />
    </div>
  );
}
