import { PageHeader } from '@/components/layout/page-header';
import { BrandCard } from '@/components/cards/brand-card';
import { getBrands } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Nos marques de parapharmacie',
  description:
    'Retrouvez les plus grandes marques de dermocosmétique et de parapharmacie à la Parapharmacie El Basma de Boufarik : La Roche-Posay, Avène, Bioderma, Vichy, CeraVe, Mustela, Nuxe…',
  path: '/marques',
});

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Marques', href: '/marques' }]}
        eyebrow="Marques"
        title="Les marques que nous distribuons"
        description="Une sélection de marques de référence, reconnues par les dermatologues et les professionnels de santé."
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
