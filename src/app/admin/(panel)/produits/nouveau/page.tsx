import { AdminPageHeader } from '@/components/admin/ui';
import { ProductForm } from '@/components/admin/forms/product-form';
import { getCategoryTree, getBrands } from '@/lib/data';

export default async function NewProductPage() {
  const [tree, brands] = await Promise.all([getCategoryTree(), getBrands()]);
  const categories = tree.flatMap((p) => [
    { id: p.id, name: p.name, depth: 0 },
    ...p.children.map((c) => ({ id: c.id, name: c.name, depth: 1 })),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouveau produit" description="Ajoutez un produit au catalogue." />
      <ProductForm categories={categories} brands={brands.map((b) => ({ id: b.id, name: b.name }))} />
    </div>
  );
}
