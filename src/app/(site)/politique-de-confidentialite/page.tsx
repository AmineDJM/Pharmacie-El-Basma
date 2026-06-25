import { PageHeader } from '@/components/layout/page-header';
import { Markdown } from '@/components/ui/markdown';
import { getSettings } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité de la Parapharmacie El Basma : données collectées, finalités, durée de conservation et vos droits.',
  path: '/politique-de-confidentialite',
});

export default async function PrivacyPage() {
  const s = await getSettings();

  const content = `La Parapharmacie El Basma accorde une grande importance à la protection de votre vie privée. Cette politique explique quelles données nous collectons, pourquoi, et comment vous pouvez exercer vos droits.

## Responsable du traitement

**${s.pharmacyName}**, ${s.addressLine}, ${s.city}, ${s.wilaya} (${s.country}). Contact : ${s.email} — ${s.phone}.

## Données que nous collectons

Nous ne collectons que les données strictement nécessaires :

- **Formulaire de contact :** nom, adresse e-mail, numéro de téléphone (facultatif) et le contenu de votre message.
- **Newsletter :** votre adresse e-mail, si vous choisissez de vous inscrire.
- **Navigation :** des données techniques minimales nécessaires au bon fonctionnement et à la sécurité du site.

## Finalités

Vos données sont utilisées pour :

- répondre à vos demandes d’information, de conseil ou de disponibilité de produits ;
- vous envoyer, avec votre consentement, nos actualités et offres via la newsletter ;
- améliorer la qualité et la sécurité de notre site.

## Base légale

Les traitements reposent sur votre **consentement** (newsletter), sur l’**exécution de mesures précontractuelles** (réponse à vos demandes) et sur notre **intérêt légitime** à assurer le bon fonctionnement du site, conformément à la loi n° 18-07 relative à la protection des données à caractère personnel.

## Stockage local sur votre appareil

Les fonctionnalités **Favoris**, **Comparateur** et **Produits récemment consultés** enregistrent vos sélections **localement dans votre navigateur** (stockage local). Ces informations ne sont **pas transmises** à nos serveurs et restent sur votre appareil. Vous pouvez les effacer à tout moment en vidant les données de navigation.

## Destinataires

Vos données sont destinées uniquement à l’équipe de la Parapharmacie El Basma. Elles ne sont **ni vendues, ni louées, ni cédées** à des tiers à des fins commerciales. Certains prestataires techniques (hébergeur) peuvent y avoir accès dans la stricte limite de leurs missions.

## Durée de conservation

- Messages de contact : conservés le temps nécessaire au traitement de votre demande, puis archivés ou supprimés.
- Inscription newsletter : jusqu’à votre désinscription.

## Vos droits

Vous disposez d’un droit d’**accès**, de **rectification**, d’**opposition** et de **suppression** de vos données. Pour l’exercer, écrivez-nous à ${s.email} en précisant votre demande.

## Sécurité

Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre tout accès, altération ou divulgation non autorisés.

## Modifications

Cette politique peut être mise à jour pour refléter l’évolution de nos pratiques ou de la réglementation. La date de dernière mise à jour figure ci-dessus.

## Contact

Pour toute question relative à vos données personnelles, contactez-nous à ${s.email} ou au ${s.phone}.`;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Politique de confidentialité', href: '/politique-de-confidentialite' }]}
        eyebrow="Vos données"
        title="Politique de confidentialité"
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
