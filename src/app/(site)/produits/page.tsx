import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductCard } from '@/components/product/product-card';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import {
  getProducts,
  getCategoryTree,
  getBrands,
  getCategoryBySlug,
  type ProductFilters as Filters,
} from '@/lib/data';
import { toCardData } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Tous nos produits de parapharmacie',
  description:
    'Découvrez le catalogue de la Parapharmacie El Basma à Boufarik : dermocosmétique, compléments, soins bébé, solaire, hygiène et cosmétique. Filtrez par marque et catégorie.',
  path: '/produits',
});

type SP = Promise<Record<string, string | undefined>>;

export default async function ProduitsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  let categorySlugs: string[] | undefined;
  if (sp.categorie) {
    const cat = await getCategoryBySlug(sp.categorie);
    categorySlugs = cat ? [cat.slug, ...cat.children.map((c) => c.slug)] : [sp.categorie];
  }

  const [result, tree, brands] = await Promise.all([
    getProducts({
      categorySlugs,
      brand: sp.marque,
      promo: sp.promo === '1',
      search: sp.recherche,
      sort: sp.tri as Filters['sort'],
      page,
      perPage: 12,
    }),
    getCategoryTree(),
    getBrands(),
  ]);

  const filterParams = {
    categorie: sp.categorie,
    marque: sp.marque,
    promo: sp.promo,
    tri: sp.tri,
    recherche: sp.recherche,
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Produits', href: '/produits' }]}
        eyebrow="Catalogue"
        title="Tous nos produits"
        description="Une sélection rigoureuse de produits parapharmaceutiques, validée par nos pharmaciens à Boufarik."
      />

      <section className="section">
        <div className="container">
          <ProductFilters
            categories={tree.map((c) => ({ name: c.name, slug: c.slug }))}
            brands={brands.map((b) => ({ name: b.name, slug: b.slug }))}
          />

          <p className="mb-6 mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{result.total}</span> produit
            {result.total > 1 ? 's' : ''} trouvé{result.total > 1 ? 's' : ''}
            {sp.recherche && <> pour « {sp.recherche} »</>}
          </p>

          {result.items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="Aucun produit ne correspond"
              description="Essayez d’élargir vos critères ou demandez-nous directement le produit recherché."
            >
              <Link href="/produits" className={buttonVariants({ variant: 'outline' })}>
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

          <Pagination page={result.page} pages={result.pages} basePath="/produits" params={filterParams} />
        </div>
      </section>
    </>
  );
}
