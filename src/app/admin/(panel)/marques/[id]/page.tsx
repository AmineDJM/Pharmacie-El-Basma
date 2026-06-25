import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { BrandForm } from '@/components/admin/forms/brand-form';
import { prisma } from '@/lib/db';

type Params = Promise<{ id: string }>;

export default async function EditBrandPage({ params }: { params: Params }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } }).catch(() => null);
  if (!brand) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier la marque" description={brand.name} />
      <BrandForm brand={brand} />
    </div>
  );
}
