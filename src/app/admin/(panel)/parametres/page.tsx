import { AdminPageHeader } from '@/components/admin/ui';
import { SettingsForm } from '@/components/admin/forms/settings-form';
import { getSettings } from '@/lib/data';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Paramètres du site"
        description="Coordonnées, horaires, réseaux sociaux et annonce. Ces informations sont utilisées partout sur le site."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
