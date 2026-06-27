'use client';

import { useActionState } from 'react';
import { saveArticle } from '@/lib/actions/admin';
import { Field, Input, Textarea, Select, Toggle, AdminCard, FormError, inputClass } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import { TranslationFields } from '@/components/admin/translation-fields';
import { ACCENT_KEYS } from '@/lib/visuals';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface ArticleInput {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readingTime: number;
  accent: string;
  published: boolean;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  translations?: unknown;
}

export function ArticleForm({ article }: { article?: ArticleInput }) {
  const [state, action] = useActionState(saveArticle, initial);

  return (
    <form action={action} className="space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}

      <AdminCard title="Informations principales">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre de l’article" required className="sm:col-span-2">
            <Input name="title" defaultValue={article?.title} required placeholder="Ex : Bien protéger sa peau du soleil" />
          </Field>
          <Field label="Catégorie" hint="ex: Dermocosmétique, Soins bébé…">
            <Input name="category" defaultValue={article?.category} placeholder="Conseils santé" />
          </Field>
          <Field label="Auteur">
            <Input name="author" defaultValue={article?.author} placeholder="Équipe Parapharmacie El Basma" />
          </Field>
          <Field label="Temps de lecture (min)">
            <Input name="readingTime" type="number" step="1" min="1" defaultValue={article?.readingTime ?? 4} />
          </Field>
          <Field label="Couleur d’accent">
            <Select name="accent" defaultValue={article?.accent ?? 'emerald'}>
              {ACCENT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Slug (URL)" hint="Laissez vide pour générer automatiquement." className="sm:col-span-2">
            <Input name="slug" defaultValue={article?.slug} placeholder="bien-proteger-sa-peau-du-soleil" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Contenu">
        <div className="space-y-4">
          <Field label="Extrait" hint="Court résumé affiché dans les listes.">
            <Textarea name="excerpt" rows={2} defaultValue={article?.excerpt} />
          </Field>
          <Field label="Contenu" hint="Markdown léger : ## titres, ### sous-titres, - listes, **gras**">
            <Textarea name="content" rows={12} defaultValue={article?.content} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Publication">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="published" label="Publié" defaultChecked={article ? article.published : true} />
          <Toggle name="featured" label="À la une" hint="Mis en avant sur l’accueil." defaultChecked={article?.featured} />
        </div>
      </AdminCard>

      <AdminCard title="Référencement (SEO)">
        <div className="space-y-4">
          <Field label="Titre SEO" hint="≤ 60 caractères recommandés.">
            <Input name="metaTitle" defaultValue={article?.metaTitle ?? ''} className={inputClass} />
          </Field>
          <Field label="Méta description" hint="≤ 160 caractères recommandés.">
            <Textarea name="metaDescription" rows={2} defaultValue={article?.metaDescription ?? ''} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Traductions (optionnel)" description="Versions anglaise et arabe. Laissez vide pour afficher le français.">
        <TranslationFields
          value={article?.translations}
          fields={[
            { name: 'title', label: 'Titre' },
            { name: 'excerpt', label: 'Extrait', textarea: true },
            { name: 'content', label: 'Contenu', textarea: true, rows: 8 },
          ]}
        />
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/conseils" />
      </div>
    </form>
  );
}
