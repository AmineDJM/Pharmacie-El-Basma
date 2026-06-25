'use client';

import { useActionState } from 'react';
import { saveReview } from '@/lib/actions/admin';
import { Field, Input, Textarea, Select, Toggle, AdminCard, FormError } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface ReviewInput {
  id: string;
  author: string;
  content: string;
  rating: number;
  source: string;
  location: string;
  approved: boolean;
  featured: boolean;
}

export function ReviewForm({ review }: { review?: ReviewInput }) {
  const [state, action] = useActionState(saveReview, initial);

  return (
    <form action={action} className="space-y-6">
      {review && <input type="hidden" name="id" value={review.id} />}

      <AdminCard title="Avis client">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Auteur" required>
            <Input name="author" defaultValue={review?.author} required placeholder="Ex : Sarah B." />
          </Field>
          <Field label="Localisation" hint="ex: Boufarik, Blida">
            <Input name="location" defaultValue={review?.location} placeholder="Boufarik" />
          </Field>
          <Field label="Note">
            <Select name="rating" defaultValue={String(review?.rating ?? 5)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Source">
            <Select name="source" defaultValue={review?.source ?? 'Google'}>
              <option value="Google">Google</option>
              <option value="Facebook">Facebook</option>
              <option value="Sur place">Sur place</option>
            </Select>
          </Field>
          <Field label="Texte de l’avis" required className="sm:col-span-2">
            <Textarea name="content" rows={5} defaultValue={review?.content} required />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Affichage">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="approved" label="Approuvé" hint="Visible sur le site." defaultChecked={review ? review.approved : true} />
          <Toggle name="featured" label="À la une" hint="Mis en avant sur l’accueil." defaultChecked={review?.featured} />
        </div>
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/avis" />
      </div>
    </form>
  );
}
