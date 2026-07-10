import { PageHeader } from '@/components/layout/page-header';
import { CartView } from '@/components/cart/cart-view';
import { getDeliveryOptions } from '@/lib/data';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Mon panier',
  description: 'Consultez les produits de votre panier et passez commande auprès de la Parapharmacie El Basma à Boufarik.',
  path: '/panier',
  noindex: true,
});

export default async function PanierPage() {
  const [{ t }, deliveryOptions] = await Promise.all([getI18n(), getDeliveryOptions()]);
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: t('cart.title'), href: '/panier' }]}
        eyebrow={t('cart.eyebrow')}
        title={t('cart.title')}
        description={t('cart.subtitle')}
      />
      <section className="section">
        <div className="container">
          <CartView deliveryOptions={deliveryOptions} />
        </div>
      </section>
    </>
  );
}
