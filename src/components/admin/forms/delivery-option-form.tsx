'use client';

import { useActionState } from 'react';
import { saveDeliveryOption } from '@/lib/actions/admin';
import { Field, Input, Textarea, Toggle, AdminCard, FormError } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface DeliveryOptionInput {
  id: string;
  name: string;
  description: string | null;
  price: number;
  groupName: string | null;
  order: number;
  active: boolean;
}

export function DeliveryOptionForm({ option }: { option?: DeliveryOptionInput }) {
  const [state, action] = useActionState(saveDeliveryOption, initial);

  return (
    <form action={action} className="space-y-6">
      {option && <input type="hidden" name="id" value={option.id} />}

      <AdminCard title="Mode de livraison">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom" required className="sm:col-span-2" hint="Ce que verra le client. Ex : « Point relais Yalidine Alger centre ».">
            <Input name="name" defaultValue={option?.name} required placeholder="Livraison à domicile" />
          </Field>
          <Field label="Transporteur / groupe" hint="Pour regrouper les options. Ex : Yalidine, DHD, Retrait.">
            <Input name="groupName" defaultValue={option?.groupName ?? ''} placeholder="Yalidine" />
          </Field>
          <Field label="Prix (DA)" required hint="Mettez 0 pour une livraison gratuite / retrait en magasin.">
            <Input name="price" type="number" step="1" min="0" defaultValue={option?.price ?? 0} required />
          </Field>
          <Field label="Description (optionnel)" className="sm:col-span-2" hint="Petite précision affichée sous le nom.">
            <Textarea name="description" rows={2} defaultValue={option?.description ?? ''} placeholder="Délai, zone couverte, etc." />
          </Field>
          <Field label="Ordre d’affichage" hint="Les plus petits chiffres apparaissent en premier.">
            <Input name="order" type="number" step="1" defaultValue={option?.order ?? 0} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Disponibilité">
        <Toggle name="active" label="Actif" hint="Décochez pour masquer ce mode sans le supprimer." defaultChecked={option ? option.active : true} />
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/livraison" />
      </div>
    </form>
  );
}
