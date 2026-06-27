'use client';

import { useActionState } from 'react';
import { saveProduct } from '@/lib/actions/admin';
import { Field, Input, Textarea, Select, Toggle, AdminCard, FormError, inputClass } from '@/components/admin/ui';
import { SubmitButton, CancelLink } from '@/components/admin/form-actions';
import { ImageUpload } from '@/components/admin/image-upload';
import { TranslationFields } from '@/components/admin/translation-fields';
import { ACCENT_KEYS } from '@/lib/visuals';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

interface ProductInput {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string | null;
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isBio: boolean;
  rating: number;
  reviewCount: number;
  highlights: string | null;
  categoryId: string;
  brandId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  translations?: unknown;
}

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: ProductInput;
  categories: { id: string; name: string; depth: number }[];
  brands: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(saveProduct, initial);

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <AdminCard title="Informations principales">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom du produit" required className="sm:col-span-2">
            <Input name="name" defaultValue={product?.name} required placeholder="Ex : Eau Micellaire Sensibio 500ml" />
          </Field>
          <Field label="Catégorie" required>
            <Select name="categoryId" defaultValue={product?.categoryId} required>
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.depth > 0 ? `  — ${c.name}` : c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Marque">
            <Select name="brandId" defaultValue={product?.brandId ?? ''}>
              <option value="">— Aucune —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Slug (URL)" hint="Laissez vide pour générer automatiquement." className="sm:col-span-2">
            <Input name="slug" defaultValue={product?.slug} placeholder="eau-micellaire-sensibio-500ml" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Prix & disponibilité">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Prix (DA)" required>
            <Input name="price" type="number" step="1" min="0" defaultValue={product?.price} required />
          </Field>
          <Field label="Ancien prix (DA)" hint="Pour afficher une promotion.">
            <Input name="oldPrice" type="number" step="1" min="0" defaultValue={product?.oldPrice ?? ''} />
          </Field>
          <Field label="Note (sur 5)">
            <Input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating ?? 4.8} />
          </Field>
          <Field label="Nombre d’avis">
            <Input name="reviewCount" type="number" min="0" defaultValue={product?.reviewCount ?? 0} />
          </Field>
          <div className="sm:col-span-3">
            <ImageUpload name="imageUrl" defaultValue={product?.imageUrl} label="Image du produit" hint="Optionnel : sinon un visuel élégant est généré automatiquement. Redimensionnement & optimisation automatiques." />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Contenu">
        <div className="space-y-4">
          <Field label="Description courte" hint="Affichée sur les cartes produit.">
            <Textarea name="shortDescription" rows={2} defaultValue={product?.shortDescription} />
          </Field>
          <Field label="Description complète" hint="Markdown léger : ## titres, - listes, **gras**.">
            <Textarea name="description" rows={6} defaultValue={product?.description} />
          </Field>
          <Field label="Points forts" hint="Un point fort par ligne.">
            <Textarea name="highlights" rows={4} defaultValue={product?.highlights ?? ''} placeholder={'Sélectionné par nos pharmaciens\nQualité dermocosmétique'} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Mise en avant">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="inStock" label="En stock" defaultChecked={product ? product.inStock : true} />
          <Toggle name="isFeatured" label="Produit mis en avant" hint="Affiché sur l’accueil." defaultChecked={product?.isFeatured} />
          <Toggle name="isNew" label="Nouveauté" defaultChecked={product?.isNew} />
          <Toggle name="isBestSeller" label="Meilleure vente" defaultChecked={product?.isBestSeller} />
          <Toggle name="isBio" label="Produit bio / naturel" hint="Apparaît sur la page Bio." defaultChecked={product?.isBio} />
        </div>
      </AdminCard>

      <AdminCard title="Référencement (SEO)">
        <div className="space-y-4">
          <Field label="Titre SEO" hint="≤ 60 caractères recommandés.">
            <Input name="metaTitle" defaultValue={product?.metaTitle ?? ''} className={inputClass} />
          </Field>
          <Field label="Méta description" hint="≤ 160 caractères recommandés.">
            <Textarea name="metaDescription" rows={2} defaultValue={product?.metaDescription ?? ''} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Traductions (optionnel)" description="Versions anglaise et arabe. Laissez vide pour afficher le français.">
        <TranslationFields
          value={product?.translations}
          fields={[
            { name: 'name', label: 'Nom' },
            { name: 'shortDescription', label: 'Description courte', textarea: true },
            { name: 'description', label: 'Description complète', textarea: true, rows: 5 },
          ]}
        />
      </AdminCard>

      <FormError message={state.message} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <CancelLink href="/admin/produits" />
      </div>
    </form>
  );
}
