import { PageHeader } from '@/components/layout/page-header';
import { CompareView } from '@/components/compare/compare-view';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Comparateur de produits',
  description: 'Comparez côte à côte les produits de parapharmacie (prix, marque, note) pour faire le meilleur choix.',
  path: '/comparateur',
  noindex: true,
});

export default function ComparateurPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Comparateur', href: '/comparateur' }]}
        eyebrow="Outil d’aide au choix"
        title="Comparateur de produits"
        description="Analysez vos produits côte à côte pour choisir celui qui vous convient le mieux."
      />
      <section className="section">
        <div className="container">
          <CompareView />
        </div>
      </section>
    </>
  );
}
