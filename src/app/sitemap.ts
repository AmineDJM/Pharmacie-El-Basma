import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { siteConfig } from '@/lib/constants';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1, lastModified: now },
    { url: `${base}/produits`, changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { url: `${base}/promotions`, changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { url: `${base}/marques`, changeFrequency: 'weekly', priority: 0.7, lastModified: now },
    { url: `${base}/conseils-sante`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${base}/a-propos`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2, lastModified: now },
    { url: `${base}/politique-de-confidentialite`, changeFrequency: 'yearly', priority: 0.2, lastModified: now },
  ];

  try {
    const [products, categories, brands, articles] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...products.map((p) => ({
        url: `${base}/produits/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...categories.map((c) => ({
        url: `${base}/categories/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...brands.map((b) => ({
        url: `${base}/marques/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
      ...articles.map((a) => ({
        url: `${base}/conseils-sante/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
