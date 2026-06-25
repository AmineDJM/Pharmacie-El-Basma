import { PageHeader } from '@/components/layout/page-header';
import { Markdown } from '@/components/ui/markdown';
import { getSettings } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site de la Parapharmacie El Basma à Boufarik (Blida, Algérie).',
  path: '/mentions-legales',
});

export default async function LegalPage() {
  const s = await getSettings();

  const content = `## Éditeur du site

Le présent site est édité par **${s.pharmacyName}**, parapharmacie située ${s.addressLine}, ${s.city}, ${s.wilaya} (${s.country}).

- **Téléphone :** ${s.phone}
- **E-mail :** ${s.email}
- **Activité :** vente de produits parapharmaceutiques (dermocosmétique, compléments alimentaires, hygiène, soins bébé et bien-être).

## Directeur de la publication

Le directeur de la publication est le responsable de la Parapharmacie El Basma.

## Hébergement

Le site est hébergé par **Render Services, Inc.**, plateforme d’hébergement cloud, accessible à l’adresse ${siteConfig.url}.

## Propriété intellectuelle

L’ensemble des éléments composant ce site (textes, visuels, logo, charte graphique, code) est la propriété de la Parapharmacie El Basma ou de ses partenaires. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable écrite, est interdite et constituerait une contrefaçon.

Les marques et logos cités sur le site appartiennent à leurs propriétaires respectifs et sont mentionnés à titre informatif.

## Responsabilité

Les informations diffusées sur ce site sont fournies à titre indicatif. Elles **ne remplacent en aucun cas un avis médical** ou la consultation d’un professionnel de santé. Pour tout traitement, symptôme ou question de santé, consultez votre médecin ou votre pharmacien.

La Parapharmacie El Basma s’efforce d’assurer l’exactitude des informations (prix, disponibilité, descriptifs) mais ne saurait être tenue responsable d’éventuelles erreurs, omissions ou indisponibilités. Les prix et la disponibilité des produits peuvent évoluer ; nous vous invitons à vérifier la disponibilité avant tout déplacement.

## Données personnelles

Le traitement de vos données personnelles est décrit dans notre **Politique de confidentialité**, conformément à la loi algérienne n° 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.

## Liens externes

Le site peut contenir des liens vers des sites tiers (cartographie, réseaux sociaux). La Parapharmacie El Basma n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.

## Droit applicable

Les présentes mentions légales sont soumises au droit algérien. Tout litige relatif à l’utilisation du site relève de la compétence des juridictions algériennes.

## Contact

Pour toute question relative au site, vous pouvez nous écrire à ${s.email} ou nous contacter au ${s.phone}.`;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Mentions légales', href: '/mentions-legales' }]}
        eyebrow="Informations légales"
        title="Mentions légales"
        description="Dernière mise à jour : juin 2026"
      />
      <section className="section">
        <div className="container max-w-3xl">
          <Markdown content={content} />
        </div>
      </section>
    </>
  );
}
