'use client';

import { useActionState } from 'react';
import { saveSettings } from '@/lib/actions/admin';
import { Field, Input, Textarea, Toggle, AdminCard, FormError, FormSuccess } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/form-actions';
import type { FormState } from '@/lib/actions/public';
import type { Settings } from '@/lib/data';

const initial: FormState = { ok: false, message: '' };

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useActionState(saveSettings, initial);
  const hoursText = settings.openingHours.map((o) => `${o.day} | ${o.hours}`).join('\n');

  return (
    <form action={action} className="space-y-6">
      <AdminCard title="Identité">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la parapharmacie">
              <Input name="pharmacyName" defaultValue={settings.pharmacyName} />
            </Field>
            <Field label="Slogan">
              <Input name="tagline" defaultValue={settings.tagline} />
            </Field>
          </div>
          <Field label="Description" hint="Utilisée pour le SEO et le pied de page.">
            <Textarea name="description" rows={3} defaultValue={settings.description} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Contact">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Téléphone">
            <Input name="phone" defaultValue={settings.phone} placeholder="+213 25 00 00 00" />
          </Field>
          <Field label="WhatsApp" hint="Chiffres uniquement, ex : 213660000000">
            <Input name="whatsapp" defaultValue={settings.whatsapp} placeholder="213660000000" />
          </Field>
          <Field label="E-mail">
            <Input name="email" type="email" defaultValue={settings.email} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Adresse & localisation">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adresse" className="sm:col-span-2">
            <Input name="addressLine" defaultValue={settings.addressLine} />
          </Field>
          <Field label="Ville">
            <Input name="city" defaultValue={settings.city} />
          </Field>
          <Field label="Wilaya">
            <Input name="wilaya" defaultValue={settings.wilaya} />
          </Field>
          <Field label="Code postal">
            <Input name="postalCode" defaultValue={settings.postalCode} />
          </Field>
          <Field label="Pays">
            <Input name="country" defaultValue={settings.country} />
          </Field>
          <Field label="Latitude" hint="Pour la carte Google Maps.">
            <Input name="latitude" type="number" step="any" defaultValue={settings.latitude} />
          </Field>
          <Field label="Longitude">
            <Input name="longitude" type="number" step="any" defaultValue={settings.longitude} />
          </Field>
          <Field label="Lien Google Maps (itinéraire)" hint="Optionnel : sinon généré depuis les coordonnées." className="sm:col-span-2">
            <Input name="mapsUrl" type="url" defaultValue={settings.mapsUrl} placeholder="https://maps.app.goo.gl/…" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Horaires d’ouverture" description="Une ligne par jour, au format : Jour | 08:30 – 20:00">
        <Field label="Horaires">
          <Textarea name="openingHours" rows={7} defaultValue={hoursText} className="font-mono text-sm" />
        </Field>
      </AdminCard>

      <AdminCard title="Réseaux sociaux">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Page Facebook (URL)">
            <Input name="facebookUrl" type="url" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/…" />
          </Field>
          <Field label="Compte Instagram (URL)">
            <Input name="instagramUrl" type="url" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/…" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Bandeau d’annonce">
        <div className="space-y-4">
          <Field label="Texte de l’annonce" hint="Affiché en haut du site.">
            <Input name="announcement" defaultValue={settings.announcement} />
          </Field>
          <Toggle name="announcementActive" label="Afficher le bandeau d’annonce" defaultChecked={settings.announcementActive} />
        </div>
      </AdminCard>

      {state.ok ? <FormSuccess message={state.message} /> : <FormError message={state.message} />}
      <div className="flex flex-wrap gap-3">
        <SubmitButton label="Enregistrer les paramètres" />
      </div>
    </form>
  );
}
