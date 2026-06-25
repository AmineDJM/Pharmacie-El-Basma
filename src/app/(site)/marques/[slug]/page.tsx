import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PackageSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductCard } from '@/components/product/product-card';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import {
  getBrandBySlug,
  getProducts,
  getCategoryTree,
  getCategoryBySlug,
  type ProductFilters as Filters,
} from '@/lib/data';
import { toCardData } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return buildMetadata({ title: 'Marque introuvable', description: '', path: `/marques/${slug}`, noindex: true });
  return buildMetadata({
    title: brand.metaTitle || `${brand.name} à Boufarik — Parapharmacie El Basma`,
    description: brand.metaDescription || `${brand.description || `Produits ${brand.name}`} Disponibles à la Parapharmacie El Basma, Boufarik (Blida).`,
    path: `/marques/${brand.slug}`,
  });
}

export default async function BrandPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  let categorySlugs: string[] | undefined;
  if (sp.categorie) {
    const cat = await getCategoryBySlug(sp.categorie);
    categorySlugs = cat ? [cat.slug, ...cat.children.map((c) => c.slug)] : [sp.categorie];
  }

  const [result, tree] = await Promise.all([
    getProducts({
      brand: brand.slug,
      categorySlugs,
      promo: sp.promo === '1',
      search: sp.recherche,
      sort: sp.tri as Filters['sort'],
      page,
      perPage: 12,
    }),
    getCategoryTree(),
  ]);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Marques', href: '/marques' },
          { label: brand.name, href: `/marques/${brand.slug}` },
        ]}
        eyebrow="Marque"
        title={brand.name}
        description={brand.description || undefined}
      />

      <section className="section">
        <div className="container">
          <ProductFilters
            categories={tree.map((c) => ({ name: c.name, slug: c.slug }))}
            brands={[]}
            basePath={`/marques/${brand.slug}`}
          />

          <p className="mb-6 mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{result.total}</span> produit{result.total > 1 ? 's' : ''} {brand.name}
          </p>

          {result.items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="Aucun produit pour ce filtre"
              description={`Demandez-nous les produits ${brand.name} qui vous intéressent.`}
            >
              <Link href={`/marques/${brand.slug}`} className={buttonVariants({ variant: 'outline' })}>
                Réinitialiser
              </Link>
              <Link href="/contact?sujet=disponibilite" className={buttonVariants()}>
                Demander un produit
              </Link>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {result.items.map((p, i) => (
                <ProductCard key={p.id} product={toCardData(p)} priority={i < 4} />
              ))}
            </div>
          )}

          <Pagination
            page={result.page}
            pages={result.pages}
            basePath={`/marques/${brand.slug}`}
            params={{ categorie: sp.categorie, promo: sp.promo, tri: sp.tri, recherche: sp.recherche }}
          />
        </div>
      </section>
    </>
  );
}
