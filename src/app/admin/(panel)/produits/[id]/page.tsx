import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { ProductForm } from '@/components/admin/forms/product-form';
import { prisma } from '@/lib/db';
import { getCategoryTree, getBrands } from '@/lib/data';

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, tree, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }).catch(() => null),
    getCategoryTree(),
    getBrands(),
  ]);
  if (!product) notFound();

  const categories = tree.flatMap((p) => [
    { id: p.id, name: p.name, depth: 0 },
    ...p.children.map((c) => ({ id: c.id, name: c.name, depth: 1 })),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier le produit" description={product.name} />
      <ProductForm product={product} categories={categories} brands={brands.map((b) => ({ id: b.id, name: b.name }))} />
    </div>
  );
}
