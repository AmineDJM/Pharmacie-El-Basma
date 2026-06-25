import { PageHeader } from '@/components/layout/page-header';
import { FavoritesView } from '@/components/favorites/favorites-view';
import { RecentlyViewed } from '@/components/product/recently-viewed';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Mes favoris',
  description: 'Retrouvez les produits que vous avez ajoutés à vos favoris sur le site de la Parapharmacie El Basma.',
  path: '/favoris',
  noindex: true,
});

export default function FavorisPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Mes favoris', href: '/favoris' }]}
        eyebrow="Ma sélection"
        title="Mes produits favoris"
        description="Vos coups de cœur, sauvegardés sur cet appareil pour les retrouver à tout moment."
      />
      <section className="section">
        <div className="container">
          <FavoritesView />
        </div>
      </section>
      <RecentlyViewed />
    </>
  );
}
