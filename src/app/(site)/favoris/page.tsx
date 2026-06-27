import { PageHeader } from '@/components/layout/page-header';
import { FavoritesView } from '@/components/favorites/favorites-view';
import { RecentlyViewed } from '@/components/product/recently-viewed';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Mes favoris',
  description: 'Retrouvez les produits que vous avez ajoutés à vos favoris sur le site de la Parapharmacie El Basma.',
  path: '/favoris',
  noindex: true,
});

export default async function FavorisPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Mes favoris', href: '/favoris' }]}
        eyebrow={t('pages.favoritesEyebrow')}
        title={t('pages.favoritesTitle')}
        description={t('pages.favoritesText')}
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
