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
  getCategoryBySlug,
  getProducts,
  getBrands,
  type ProductFilters as Filters,
} from '@/lib/data';
import { getI18n } from '@/i18n/locale';
import { tField } from '@/lib/localize';
import { toCardData } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: 'Catégorie introuvable', description: '', path: `/categories/${slug}`, noindex: true });
  return buildMetadata({
    title: category.metaTitle || `${category.name} à Boufarik`,
    description:
      category.metaDescription ||
      `${category.description || `Découvrez notre sélection ${category.name.toLowerCase()}`} — Parapharmacie El Basma, Boufarik (Blida).`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { locale, t } = await getI18n();
  const catName = tField(category, locale, 'name', category.name);
  const catDesc = category.description ? tField(category, locale, 'description', category.description) : undefined;

  const page = Math.max(1, Number(sp.page) || 1);
  const categorySlugs = [category.slug, ...category.children.map((c) => c.slug)];

  const [result, brands] = await Promise.all([
    getProducts({
      categorySlugs,
      brand: sp.marque,
      promo: sp.promo === '1',
      search: sp.recherche,
      sort: sp.tri as Filters['sort'],
      page,
      perPage: 12,
    }),
    getBrands(),
  ]);

  const breadcrumbs = [
    { label: t('nav.products'), href: '/produits' },
    ...(category.parent
      ? [{ label: tField(category.parent, locale, 'name', category.parent.name), href: `/categories/${category.parent.slug}` }]
      : []),
    { label: catName, href: `/categories/${category.slug}` },
  ];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} eyebrow="Catégorie" title={catName} description={catDesc}>
        {category.children.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.slug}
                href={`/categories/${child.slug}`}
                className={cn(
                  'rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary',
                )}
              >
                {tField(child, locale, 'name', child.name)}
              </Link>
            ))}
          </div>
        )}
      </PageHeader>

      <section className="section">
        <div className="container">
          <ProductFilters
            categories={[]}
            brands={brands.map((b) => ({ name: b.name, slug: b.slug }))}
            basePath={`/categories/${category.slug}`}
            showCategory={false}
          />

          <p className="mb-6 mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{result.total}</span> produit{result.total > 1 ? 's' : ''}
          </p>

          {result.items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="Bientôt disponible"
              description="Cette catégorie s’enrichit régulièrement. Contactez-nous pour un produit précis."
            >
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
            basePath={`/categories/${category.slug}`}
            params={{ marque: sp.marque, promo: sp.promo, tri: sp.tri, recherche: sp.recherche }}
          />
        </div>
      </section>
    </>
  );
}
