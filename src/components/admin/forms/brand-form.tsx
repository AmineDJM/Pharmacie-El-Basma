'use client';

import { useActionState } from 'react';
import { saveBrand } from '@/lib/actions/admin';
import { Field, Input, Textarea, Select, Toggle, AdminCard, FormError, inputClass } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import { ACCENT_KEYS } from '@/lib/visuals';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface BrandInput {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent: string;
  featured: boolean;
  order: number;
  metaTitle: string | null;
  metaDescription: string | null;
}

export function BrandForm({ brand }: { brand?: BrandInput }) {
  const [state, action] = useActionState(saveBrand, initial);

  return (
    <form action={action} className="space-y-6">
      {brand && <input type="hidden" name="id" value={brand.id} />}

      <AdminCard title="Informations principales">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom de la marque" required className="sm:col-span-2">
            <Input name="name" defaultValue={brand?.name} required placeholder="Ex : La Roche-Posay" />
          </Field>
          <Field label="Couleur d’accent">
            <Select name="accent" defaultValue={brand?.accent ?? 'teal'}>
              {ACCENT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ordre d’affichage" hint="Les plus petits chiffres apparaissent en premier.">
            <Input name="order" type="number" step="1" defaultValue={brand?.order ?? 0} />
          </Field>
          <Field label="Slug (URL)" hint="Laissez vide pour générer automatiquement." className="sm:col-span-2">
            <Input name="slug" defaultValue={brand?.slug} placeholder="la-roche-posay" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Présentation">
        <div className="space-y-4">
          <Field label="Description">
            <Textarea name="description" rows={3} defaultValue={brand?.description ?? ''} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Mise en avant">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="featured" label="Mettre en avant" hint="Affichée parmi les marques partenaires." defaultChecked={brand?.featured} />
        </div>
      </AdminCard>

      <AdminCard title="Référencement (SEO)">
        <div className="space-y-4">
          <Field label="Titre SEO" hint="≤ 60 caractères recommandés.">
            <Input name="metaTitle" defaultValue={brand?.metaTitle ?? ''} className={inputClass} />
          </Field>
          <Field label="Méta description" hint="≤ 160 caractères recommandés.">
            <Textarea name="metaDescription" rows={2} defaultValue={brand?.metaDescription ?? ''} />
          </Field>
        </div>
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/marques" />
      </div>
    </form>
  );
}
