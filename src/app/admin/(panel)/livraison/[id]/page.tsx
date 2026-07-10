import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { DeliveryOptionForm } from '@/components/admin/forms/delivery-option-form';
import { prisma } from '@/lib/db';

type Params = Promise<{ id: string }>;

export default async function EditDeliveryOptionPage({ params }: { params: Params }) {
  const { id } = await params;
  const option = await prisma.deliveryOption.findUnique({ where: { id } }).catch(() => null);
  if (!option) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier le mode de livraison" description={option.name} />
      <DeliveryOptionForm option={option} />
    </div>
  );
}
