import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FloatingActions } from '@/components/layout/floating-actions';
import { getSettings } from '@/lib/data';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader />
      <main id="contenu">{children}</main>
      <SiteFooter />
      <FloatingActions phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
