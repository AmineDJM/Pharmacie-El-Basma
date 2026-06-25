'use client';

import { useActionState } from 'react';
import { saveFaq } from '@/lib/actions/admin';
import { Field, Input, Textarea, Toggle, AdminCard, FormError } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface FaqInput {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export function FaqForm({ faq }: { faq?: FaqInput }) {
  const [state, action] = useActionState(saveFaq, initial);

  return (
    <form action={action} className="space-y-6">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <AdminCard title="Question fréquente">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Question" required className="sm:col-span-2">
            <Input name="question" defaultValue={faq?.question} required placeholder="Ex : Proposez-vous la livraison ?" />
          </Field>
          <Field label="Catégorie" hint="ex: Commande & disponibilité, Livraison…">
            <Input name="category" defaultValue={faq?.category} placeholder="Général" />
          </Field>
          <Field label="Ordre d’affichage" hint="Les plus petits chiffres apparaissent en premier.">
            <Input name="order" type="number" step="1" defaultValue={faq?.order ?? 0} />
          </Field>
          <Field label="Réponse" required className="sm:col-span-2">
            <Textarea name="answer" rows={5} defaultValue={faq?.answer} required />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Publication">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="published" label="Publié" defaultChecked={faq ? faq.published : true} />
        </div>
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/faq" />
      </div>
    </form>
  );
}
