import { unstable_cache } from 'next/cache';
import { prisma } from './db';
import { siteConfig, DEFAULT_OPENING_HOURS } from './constants';
import type { Prisma } from '@prisma/client';

/**
 * Build-safe data access layer.
 *
 * Every reader is wrapped so a missing/unreachable database (e.g. during
 * `next build` before migrations run) returns a safe fallback instead of
 * crashing. Hot read paths are cached with tags and revalidated on admin
 * mutations (see lib/revalidate.ts).
 */

export const TAGS = {
  products: 'products',
  categories: 'categories',
  brands: 'brands',
  articles: 'articles',
  reviews: 'reviews',
  faqs: 'faqs',
  settings: 'settings',
  delivery: 'delivery',
} as const;

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[data] read failed, using fallback:', (error as Error).message);
    }
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Settings {
  pharmacyName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  city: string;
  wilaya: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  openingHours: OpeningHour[];
  facebookUrl: string;
  instagramUrl: string;
  announcement: string;
  announcementActive: boolean;
  mapsUrl: string;
}

const FALLBACK_SETTINGS: Settings = {
  pharmacyName: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  phone: siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  email: siteConfig.contact.email,
  addressLine: siteConfig.address.street,
  city: siteConfig.address.city,
  wilaya: siteConfig.address.wilaya,
  country: siteConfig.address.country,
  postalCode: siteConfig.address.postalCode,
  latitude: siteConfig.geo.latitude,
  longitude: siteConfig.geo.longitude,
  openingHours: DEFAULT_OPENING_HOURS,
  facebookUrl: '',
  instagramUrl: '',
  announcement: 'Livraison à Boufarik & Blida — Conseils gratuits par nos pharmaciens',
  announcementActive: true,
  mapsUrl: '',
};

export const getSettings = unstable_cache(
  async (): Promise<Settings> =>
    safe(async () => {
      const row = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
      if (!row) return FALLBACK_SETTINGS;
      let openingHours: OpeningHour[] = DEFAULT_OPENING_HOURS;
      try {
        const parsed = JSON.parse(row.openingHours);
        if (Array.isArray(parsed) && parsed.length) openingHours = parsed;
      } catch {
        /* keep default */
      }
      return { ...row, openingHours } as Settings;
    }, FALLBACK_SETTINGS),
  ['settings'],
  { tags: [TAGS.settings], revalidate: 300 },
);

// ---------------------------------------------------------------------------
// Includes / types
// ---------------------------------------------------------------------------

const productInclude = {
  category: { select: { name: true, slug: true, accent: true, translations: true } },
  brand: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude;

export type ProductCard = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const getCategoryTree = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.category.findMany({
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
              include: { _count: { select: { products: true } } },
            },
            _count: { select: { products: true } },
          },
        }),
      [],
    ),
  ['category-tree'],
  { tags: [TAGS.categories], revalidate: 300 },
);

export const getFeaturedCategories = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.category.findMany({
          where: { featured: true },
          orderBy: { order: 'asc' },
          take: 8,
          include: { _count: { select: { products: true } } },
        }),
      [],
    ),
  ['featured-categories'],
  { tags: [TAGS.categories], revalidate: 300 },
);

export const getAllCategories = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.category.findMany({
          orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
          include: { parent: { select: { name: true } }, _count: { select: { products: true } } },
        }),
      [],
    ),
  ['all-categories'],
  { tags: [TAGS.categories], revalidate: 300 },
);

export async function getCategoryBySlug(slug: string) {
  return safe(
    () =>
      prisma.category.findUnique({
        where: { slug },
        include: {
          parent: { select: { name: true, slug: true, translations: true } },
          children: { orderBy: { order: 'asc' } },
        },
      }),
    null,
  );
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export const getBrands = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.brand.findMany({
          orderBy: [{ featured: 'desc' }, { order: 'asc' }, { name: 'asc' }],
          include: { _count: { select: { products: true } } },
        }),
      [],
    ),
  ['brands'],
  { tags: [TAGS.brands], revalidate: 300 },
);

export const getFeaturedBrands = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.brand.findMany({
          where: { featured: true },
          orderBy: { order: 'asc' },
          take: 12,
        }),
      [],
    ),
  ['featured-brands'],
  { tags: [TAGS.brands], revalidate: 300 },
);

export async function getBrandBySlug(slug: string) {
  return safe(() => prisma.brand.findUnique({ where: { slug } }), null);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const getFeaturedProducts = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.product.findMany({
          where: { isFeatured: true },
          orderBy: { updatedAt: 'desc' },
          take: 8,
          include: productInclude,
        }),
      [],
    ),
  ['featured-products'],
  { tags: [TAGS.products], revalidate: 300 },
);

export const getBestSellers = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.product.findMany({
          where: { isBestSeller: true },
          orderBy: { reviewCount: 'desc' },
          take: 8,
          include: productInclude,
        }),
      [],
    ),
  ['best-sellers'],
  { tags: [TAGS.products], revalidate: 300 },
);

export const getNewProducts = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.product.findMany({
          where: { isNew: true },
          orderBy: { createdAt: 'desc' },
          take: 8,
          include: productInclude,
        }),
      [],
    ),
  ['new-products'],
  { tags: [TAGS.products], revalidate: 300 },
);

export const getPromoProducts = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.product.findMany({
          where: { oldPrice: { not: null } },
          orderBy: { updatedAt: 'desc' },
          take: 12,
          include: productInclude,
        }),
      [],
    ),
  ['promo-products'],
  { tags: [TAGS.products], revalidate: 300 },
);

export interface ProductFilters {
  category?: string;
  categorySlugs?: string[];
  brand?: string;
  search?: string;
  promo?: boolean;
  bio?: boolean;
  sort?: 'recent' | 'price-asc' | 'price-desc' | 'ventes' | 'nouveautes';
  page?: number;
  perPage?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  const { category, categorySlugs, brand, search, promo, bio, sort = 'recent', page = 1, perPage = 12 } = filters;

  const where: Prisma.ProductWhereInput = {};
  if (categorySlugs?.length) where.category = { slug: { in: categorySlugs } };
  else if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (promo) where.oldPrice = { not: null };
  if (bio) where.isBio = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price-asc'
      ? { price: 'asc' }
      : sort === 'price-desc'
        ? { price: 'desc' }
        : sort === 'ventes'
          ? { reviewCount: 'desc' }
          : sort === 'nouveautes'
            ? { createdAt: 'desc' }
            : { updatedAt: 'desc' };

  return safe(
    async () => {
      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
          include: productInclude,
        }),
        prisma.product.count({ where }),
      ]);
      return { items, total, page, perPage, pages: Math.ceil(total / perPage) || 1 };
    },
    { items: [], total: 0, page, perPage, pages: 1 },
  );
}

export async function getProductBySlug(slug: string) {
  return safe(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: { select: { name: true, slug: true, accent: true, translations: true } },
          brand: { select: { name: true, slug: true } },
        },
      }),
    null,
  );
}

export async function getSimilarProducts(productId: string, categoryId: string, take = 4) {
  return safe(
    () =>
      prisma.product.findMany({
        where: { categoryId, NOT: { id: productId } },
        orderBy: { isBestSeller: 'desc' },
        take,
        include: productInclude,
      }),
    [],
  );
}

export async function searchProducts(query: string, take = 6) {
  const q = query.trim();
  if (!q) return [];
  return safe(
    () =>
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { brand: { name: { contains: q, mode: 'insensitive' } } },
            { category: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
        take,
        include: productInclude,
      }),
    [],
  );
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const getArticles = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.article.findMany({
          where: { published: true },
          orderBy: { publishedAt: 'desc' },
        }),
      [],
    ),
  ['articles'],
  { tags: [TAGS.articles], revalidate: 300 },
);

export const getFeaturedArticles = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.article.findMany({
          where: { published: true, featured: true },
          orderBy: { publishedAt: 'desc' },
          take: 3,
        }),
      [],
    ),
  ['featured-articles'],
  { tags: [TAGS.articles], revalidate: 300 },
);

export async function getArticleBySlug(slug: string) {
  return safe(() => prisma.article.findUnique({ where: { slug } }), null);
}

// ---------------------------------------------------------------------------
// Reviews & FAQ
// ---------------------------------------------------------------------------

export const getReviews = unstable_cache(
  async () =>
    safe(
      () => prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } }),
      [],
    ),
  ['reviews'],
  { tags: [TAGS.reviews], revalidate: 300 },
);

export const getFeaturedReviews = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.review.findMany({
          where: { approved: true, featured: true },
          orderBy: { createdAt: 'desc' },
          take: 6,
        }),
      [],
    ),
  ['featured-reviews'],
  { tags: [TAGS.reviews], revalidate: 300 },
);

export const getFaqs = unstable_cache(
  async () =>
    safe(
      () => prisma.faq.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
      [],
    ),
  ['faqs'],
  { tags: [TAGS.faqs], revalidate: 300 },
);

// ---------------------------------------------------------------------------
// Modes de livraison
// ---------------------------------------------------------------------------

export const getDeliveryOptions = unstable_cache(
  async () =>
    safe(
      () =>
        prisma.deliveryOption.findMany({
          where: { active: true },
          orderBy: [{ order: 'asc' }, { price: 'asc' }],
          select: { id: true, name: true, description: true, price: true, groupName: true },
        }),
      [],
    ),
  ['delivery-options'],
  { tags: [TAGS.delivery], revalidate: 300 },
);
