import type { Metadata } from 'next';
import { siteConfig } from './constants';
import type { Settings } from './data';
import { discountPercent, formatPrice } from './utils';

interface BuildMetaInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  images?: { url: string; alt?: string }[];
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
}

/** Compose a fully-formed Next.js Metadata object with OG + Twitter + canonical. */
export function buildMetadata({
  title,
  description,
  path = '/',
  keywords,
  images,
  type = 'website',
  noindex = false,
  publishedTime,
}: BuildMetaInput): Metadata {
  const url = path === '/' ? siteConfig.url : `${siteConfig.url}${path}`;
  const ogImages = images?.length
    ? images.map((i) => ({ url: i.url, alt: i.alt ?? title, width: 1200, height: 630 }))
    : [{ url: '/opengraph-image', alt: siteConfig.name, width: 1200, height: 630 }];

  return {
    title,
    description,
    keywords: keywords ?? Array.from(siteConfig.keywords),
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'fr_DZ',
      images: ogImages,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

const DAY_MAP: Record<string, string> = {
  Lundi: 'Monday',
  Mardi: 'Tuesday',
  Mercredi: 'Wednesday',
  Jeudi: 'Thursday',
  Vendredi: 'Friday',
  Samedi: 'Saturday',
  Dimanche: 'Sunday',
};

function openingHoursSpec(settings: Settings) {
  return settings.openingHours
    .map((oh) => {
      const match = oh.hours.match(/(\d{1,2})[:hH](\d{2})\s*[–-]\s*(\d{1,2})[:hH](\d{2})/);
      const day = DAY_MAP[oh.day];
      if (!match || !day) return null;
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${day}`,
        opens: `${match[1].padStart(2, '0')}:${match[2]}`,
        closes: `${match[3].padStart(2, '0')}:${match[4]}`,
      };
    })
    .filter(Boolean);
}

export function localBusinessSchema(settings: Settings) {
  const sameAs = [settings.facebookUrl, settings.instagramUrl].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['Pharmacy', 'HealthAndBeautyBusiness', 'Store'],
    '@id': `${siteConfig.url}/#business`,
    name: settings.pharmacyName,
    description: settings.description,
    url: siteConfig.url,
    telephone: settings.phone,
    email: settings.email,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/icon.svg`,
    priceRange: 'DZD',
    currenciesAccepted: 'DZD',
    paymentAccepted: 'Espèces, Carte',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.addressLine,
      addressLocality: settings.city,
      addressRegion: settings.wilaya,
      postalCode: settings.postalCode,
      addressCountry: 'DZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    hasMap: settings.mapsUrl || undefined,
    areaServed: [
      { '@type': 'City', name: 'Boufarik' },
      { '@type': 'City', name: 'Blida' },
      { '@type': 'AdministrativeArea', name: 'Wilaya de Blida' },
    ],
    openingHoursSpecification: openingHoursSpec(settings),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: 'fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/produits?recherche={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

export function productSchema(
  product: {
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number | null;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    brand?: { name: string } | null;
    imageUrl?: string | null;
  },
  settings: Settings,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description.slice(0, 300),
    image: product.imageUrl || `${siteConfig.url}/opengraph-image`,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand.name } } : {}),
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/produits/${product.slug}`,
      priceCurrency: 'DZD',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Pharmacy', name: settings.pharmacyName },
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function articleSchema(article: {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: Date | string;
  updatedAt: Date | string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/icon.svg` },
    },
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: `${siteConfig.url}/conseils-sante/${article.slug}`,
    image: `${siteConfig.url}/opengraph-image`,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Human-readable price label including a discount note, for OG descriptions. */
export function priceLabel(price: number, oldPrice?: number | null) {
  const pct = discountPercent(price, oldPrice);
  return pct ? `${formatPrice(price)} (−${pct}%)` : formatPrice(price);
}
