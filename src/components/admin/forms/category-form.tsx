'use client';

import { useActionState } from 'react';
import { saveCategory } from '@/lib/actions/admin';
import { Field, Input, Textarea, Select, Toggle, AdminCard, FormError, inputClass } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import { TranslationFields } from '@/components/admin/translation-fields';
import { ACCENT_KEYS } from '@/lib/visuals';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface CategoryInput {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent: string;
  parentId: string | null;
  order: number;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  translations?: unknown;
}

export function CategoryForm({
  category,
  parents,
}: {
  category?: CategoryInput;
  parents: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(saveCategory, initial);

  return (
    <form action={action} className="space-y-6">
      {category && <input type="hidden" name="id" value={category.id} />}

      <AdminCard title="Informations principales">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom de la catégorie" required className="sm:col-span-2">
            <Input name="name" defaultValue={category?.name} required placeholder="Ex : Dermocosmétique" />
          </Field>
          <Field label="Catégorie parente">
            <Select name="parentId" defaultValue={category?.parentId ?? ''}>
              <option value="">— Aucune (catégorie principale) —</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ordre d’affichage" hint="Les plus petits chiffres apparaissent en premier.">
            <Input name="order" type="number" step="1" defaultValue={category?.order ?? 0} />
          </Field>
          <Field label="Slug (URL)" hint="Laissez vide pour générer automatiquement." className="sm:col-span-2">
            <Input name="slug" defaultValue={category?.slug} placeholder="dermocosmetique" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Présentation">
        <div className="space-y-4">
          <Field label="Description">
            <Textarea name="description" rows={3} defaultValue={category?.description ?? ''} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icône" hint="Nom d’icône Lucide ex: Sparkles, Baby, Pill, Sun, Droplets, Leaf">
              <Input name="icon" defaultValue={category?.icon ?? ''} placeholder="Sparkles" />
            </Field>
            <Field label="Couleur d’accent">
              <Select name="accent" defaultValue={category?.accent ?? 'emerald'}>
                {ACCENT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Mise en avant">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="featured" label="Afficher sur l’accueil" defaultChecked={category?.featured} />
        </div>
      </AdminCard>

      <AdminCard title="Référencement (SEO)">
        <div className="space-y-4">
          <Field label="Titre SEO" hint="≤ 60 caractères recommandés.">
            <Input name="metaTitle" defaultValue={category?.metaTitle ?? ''} className={inputClass} />
          </Field>
          <Field label="Méta description" hint="≤ 160 caractères recommandés.">
            <Textarea name="metaDescription" rows={2} defaultValue={category?.metaDescription ?? ''} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Traductions (optionnel)" description="Versions anglaise et arabe. Laissez vide pour afficher le français.">
        <TranslationFields
          value={category?.translations}
          fields={[
            { name: 'name', label: 'Nom' },
            { name: 'description', label: 'Description', textarea: true },
          ]}
        />
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/categories" />
      </div>
    </form>
  );
}
