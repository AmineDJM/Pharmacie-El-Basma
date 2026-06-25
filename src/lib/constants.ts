/**
 * Static configuration used for SEO defaults and navigation.
 * Live business data (phone, hours…) is stored in the database (SiteSettings)
 * and editable from the admin panel; these values are the build-time fallback.
 */
export const siteConfig = {
  name: 'Parapharmacie El Basma',
  shortName: 'El Basma',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://parapharmacie-elbasma.dz').replace(/\/$/, ''),
  locale: 'fr_DZ',
  tagline: 'Votre parapharmacie de confiance à Boufarik',
  description:
    'Parapharmacie El Basma à Boufarik (Blida) : dermocosmétique, compléments alimentaires, soins bébé, hygiène, cosmétique et conseils santé par des professionnels. Qualité, proximité et expertise.',
  keywords: [
    'parapharmacie Boufarik',
    'pharmacie Boufarik',
    'parapharmacie Blida',
    'pharmacie Blida',
    'produits parapharmaceutiques Boufarik',
    'compléments alimentaires Boufarik',
    'cosmétique Boufarik',
    'dermocosmétique Boufarik',
    'soins bébé Boufarik',
    'parapharmacie Algérie',
    'El Basma Boufarik',
  ],
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '+213 25 00 00 00',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '213660000000',
    email: 'contact@parapharmacie-elbasma.dz',
  },
  address: {
    street: 'Rue Menad Mohamed',
    city: 'Boufarik',
    wilaya: 'Blida',
    postalCode: '09300',
    country: 'Algérie',
    countryCode: 'DZ',
  },
  geo: {
    latitude: 36.5675,
    longitude: 2.9089,
  },
  social: {
    facebook: '',
    instagram: '',
  },
} as const;

export const MAIN_NAV: { label: string; href: string }[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Produits', href: '/produits' },
  { label: 'Promotions', href: '/promotions' },
  { label: 'Conseils santé', href: '/conseils-sante' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAV: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Boutique',
    links: [
      { label: 'Tous les produits', href: '/produits' },
      { label: 'Promotions', href: '/promotions' },
      { label: 'Nos marques', href: '/marques' },
      { label: 'Nouveautés', href: '/produits?tri=nouveautes' },
      { label: 'Meilleures ventes', href: '/produits?tri=ventes' },
    ],
  },
  {
    title: 'La parapharmacie',
    links: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'Conseils santé', href: '/conseils-sante' },
      { label: 'Questions fréquentes', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Mes favoris', href: '/favoris' },
      { label: 'Comparateur', href: '/comparateur' },
      { label: 'Demander une disponibilité', href: '/contact?sujet=disponibilite' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
      { label: 'Plan du site', href: '/sitemap.xml' },
    ],
  },
];

export const DEFAULT_OPENING_HOURS = [
  { day: 'Samedi', hours: '08:30 – 20:00' },
  { day: 'Dimanche', hours: '08:30 – 20:00' },
  { day: 'Lundi', hours: '08:30 – 20:00' },
  { day: 'Mardi', hours: '08:30 – 20:00' },
  { day: 'Mercredi', hours: '08:30 – 20:00' },
  { day: 'Jeudi', hours: '08:30 – 20:00' },
  { day: 'Vendredi', hours: '14:00 – 20:00' },
];
