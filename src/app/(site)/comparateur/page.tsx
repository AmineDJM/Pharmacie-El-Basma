import { PageHeader } from '@/components/layout/page-header';
import { CompareView } from '@/components/compare/compare-view';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Comparateur de produits',
  description: 'Comparez côte à côte les produits de parapharmacie (prix, marque, note) pour faire le meilleur choix.',
  path: '/comparateur',
  noindex: true,
});

export default async function ComparateurPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Comparateur', href: '/comparateur' }]}
        eyebrow={t('pages.compareEyebrow')}
        title={t('pages.compareTitle')}
        description={t('pages.compareText')}
      />
      <section className="section">
        <div className="container">
          <CompareView />
        </div>
      </section>
    </>
  );
}
