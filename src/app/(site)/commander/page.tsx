import { PageHeader } from '@/components/layout/page-header';
import { CheckoutForm } from '@/components/cart/checkout-form';
import { getSettings, getDeliveryOptions } from '@/lib/data';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Finaliser ma commande',
  description: 'Renseignez vos coordonnées et votre adresse de livraison pour commander auprès de la Parapharmacie El Basma à Boufarik.',
  path: '/commander',
  noindex: true,
});

export default async function CommanderPage() {
  const [settings, { t }, deliveryOptions] = await Promise.all([getSettings(), getI18n(), getDeliveryOptions()]);
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t('cart.title'), href: '/panier' },
          { label: t('checkout.title'), href: '/commander' },
        ]}
        eyebrow={t('checkout.eyebrow')}
        title={t('checkout.title')}
        description={t('checkout.subtitle')}
      />
      <section className="section">
        <div className="container">
          <CheckoutForm whatsapp={settings.whatsapp} phone={settings.phone} deliveryOptions={deliveryOptions} />
        </div>
      </section>
    </>
  );
}
