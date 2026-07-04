/** Serializable category shape for the mega-menu / mobile navigation. */
export interface NavCategory {
  name: string;
  slug: string;
  icon: string | null;
  accent: string;
  count: number;
  children: { name: string; slug: string; count: number }[];
}

/** Minimal product snapshot persisted client-side (favorites, compare, history). */
export interface StoredProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  brandName?: string | null;
  categoryName?: string | null;
  accent: string;
  shortDescription: string;
  imageUrl?: string | null;
  rating: number;
}

/** A cart line: a product snapshot plus the ordered quantity. */
export interface CartItem extends StoredProduct {
  quantity: number;
}

/** Serializable product shape passed to the (client) product card. */
export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice: number | null;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isBio: boolean;
  inStock: boolean;
  imageUrl: string | null;
  brandName: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  accent: string;
  // Raw translation maps — the (client) card localises via the locale context.
  translations?: unknown;
  categoryTranslations?: unknown;
}

/** Map a Prisma product (with category/brand) to the card data shape. */
export function toCardData(p: {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isBio?: boolean;
  inStock?: boolean;
  imageUrl?: string | null;
  translations?: unknown;
  brand?: { name: string } | null;
  category?: { name: string; slug: string; accent?: string; translations?: unknown } | null;
}): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    shortDescription: p.shortDescription,
    rating: p.rating,
    reviewCount: p.reviewCount,
    isNew: p.isNew ?? false,
    isBestSeller: p.isBestSeller ?? false,
    isBio: p.isBio ?? false,
    inStock: p.inStock ?? true,
    imageUrl: p.imageUrl ?? null,
    brandName: p.brand?.name ?? null,
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
    accent: p.category?.accent ?? 'emerald',
    translations: p.translations,
    categoryTranslations: p.category?.translations,
  };
}

/** Derive the client-store snapshot from card data. */
export function cardToStored(p: ProductCardData): StoredProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice,
    brandName: p.brandName,
    categoryName: p.categoryName,
    accent: p.accent,
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl,
    rating: p.rating,
  };
}

/** Rebuild card data from a stored snapshot (favorites, history). */
export function storedToCard(p: StoredProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    shortDescription: p.shortDescription,
    rating: p.rating,
    reviewCount: 0,
    isNew: false,
    isBestSeller: false,
    isBio: false,
    inStock: true,
    imageUrl: p.imageUrl ?? null,
    brandName: p.brandName ?? null,
    categoryName: p.categoryName ?? null,
    categorySlug: null,
    accent: p.accent,
  };
}

/** Convert any product-like record into a StoredProduct snapshot. */
export function toStoredProduct(p: {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  brand?: { name: string } | null;
  category?: { name: string; accent?: string } | null;
  accent?: string;
  shortDescription: string;
  imageUrl?: string | null;
  rating: number;
}): StoredProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    brandName: p.brand?.name ?? null,
    categoryName: p.category?.name ?? null,
    accent: p.accent ?? p.category?.accent ?? 'emerald',
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl ?? null,
    rating: p.rating,
  };
}
