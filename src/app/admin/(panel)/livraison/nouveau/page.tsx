import { AdminPageHeader } from '@/components/admin/ui';
import { DeliveryOptionForm } from '@/components/admin/forms/delivery-option-form';

export default function NewDeliveryOptionPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Nouveau mode de livraison" description="Ajoutez une option de livraison proposée à la commande." />
      <DeliveryOptionForm />
    </div>
  );
}
