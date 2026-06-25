import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Truck, ShieldCheck, Stethoscope, BadgeCheck, Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductVisual } from '@/components/ui/product-visual';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Markdown } from '@/components/ui/markdown';
import { ProductActions } from '@/components/product/product-actions';
import { ProductCard } from '@/components/product/product-card';
import { TrackRecentlyViewed } from '@/components/product/recently-viewed';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/seo/json-ld';
import { getProductBySlug, getSimilarProducts, getSettings } from '@/lib/data';
import { toCardData, cardToStored } from '@/lib/types';
import { buildMetadata, productSchema, breadcrumbSchema } from '@/lib/seo';
import { formatPrice, discountPercent, parseLines } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ title: 'Produit introuvable', description: '', path: `/produits/${slug}`, noindex: true });
  return buildMetadata({
    title: product.metaTitle || `${product.name}${product.brand ? ` — ${product.brand.name}` : ''}`,
    description: product.metaDescription || product.shortDescription,
    path: `/produits/${product.slug}`,
    images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : undefined,
  });
}

const TRUST = [
  { icon: ShieldCheck, text: 'Produit authentique' },
  { icon: Stethoscope, text: 'Conseil pharmacien' },
  { icon: Truck, text: 'Disponibilité rapide' },
];

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, similar] = await Promise.all([
    getSettings(),
    getSimilarProducts(product.id, product.categoryId, 4),
  ]);

  const card = toCardData(product);
  const promo = discountPercent(product.price, product.oldPrice);
  const highlights = parseLines(product.highlights);

  return (
    <>
      <div className="container py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { label: 'Produits', href: '/produits' },
            ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
            { label: product.name, href: `/produits/${product.slug}` },
          ]}
        />

        <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Visual */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <ProductVisual
                name={product.name}
                accent={product.category?.accent}
                imageUrl={product.imageUrl}
                brandName={product.brand?.name}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-square w-full"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {TRUST.map((t) => (
                <div key={t.text} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-center">
                  <t.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category.name}</span>
                )}
                {promo && <Badge variant="promo">−{promo}%</Badge>}
                {product.isNew && <Badge variant="new">Nouveau</Badge>}
                {product.isBestSeller && <Badge variant="best">Top vente</Badge>}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
              {product.brand && <p className="text-muted-foreground">par <span className="font-medium text-foreground">{product.brand.name}</span></p>}
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <BadgeCheck className="h-4 w-4" /> Recommandé
                </span>
              </div>
            </div>

            <p className="text-pretty text-lg leading-relaxed text-foreground/90">{product.shortDescription}</p>

            <div className="flex items-end gap-3 rounded-2xl border border-border bg-secondary/40 p-5">
              <div>
                {product.oldPrice && <p className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>}
                <p className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
              </div>
              <span className={`mb-1.5 ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? 'bg-primary-50 text-primary-700 dark:bg-primary-100 dark:text-primary-900' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                <span className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-primary' : 'bg-amber-500'}`} />
                {product.inStock ? 'Disponible' : 'Sur commande'}
              </span>
            </div>

            {highlights.length > 0 && (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/85">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <ProductActions product={card} whatsapp={settings.whatsapp} phone={settings.phone} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Description</h2>
            <Markdown content={product.description} />
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">Besoin d’un conseil ?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nos pharmaciens vous accompagnent pour choisir le produit le mieux adapté à vos besoins.
              </p>
              <ProductActions product={card} whatsapp={settings.whatsapp} phone={settings.phone} />
            </div>
          </aside>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Vous aimerez aussi" title="Produits similaires" align="left" className="mb-8" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {similar.map((p) => (
                <ProductCard key={p.id} product={toCardData(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <TrackRecentlyViewed product={cardToStored(card)} />
      <JsonLd
        data={[
          productSchema(product, settings),
          breadcrumbSchema([
            { label: 'Accueil', href: '/' },
            { label: 'Produits', href: '/produits' },
            { label: product.name, href: `/produits/${product.slug}` },
          ]),
        ]}
      />
    </>
  );
}
