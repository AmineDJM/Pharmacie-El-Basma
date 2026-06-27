import Link from 'next/link';
import { Leaf, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ProductCard } from '@/components/product/product-card';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { getProducts } from '@/lib/data';
import { toCardData } from '@/lib/types';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Produits Bio & Naturels',
  description:
    'Sélection de produits bio et naturels à la Parapharmacie El Basma de Boufarik : cosmétiques naturels, huiles essentielles, compléments d’origine végétale et soins doux.',
  path: '/bio',
});

type SP = Promise<Record<string, string | undefined>>;

export default async function BioPage({ searchParams }: { searchParams: SP }) {
  const { t } = await getI18n();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const result = await getProducts({ bio: true, sort: 'recent', page, perPage: 12 });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Bio', href: '/bio' }]}
        eyebrow={<><Leaf className="h-3.5 w-3.5" /> {t('pages.bioEyebrow')}</>}
        title={t('pages.bioTitle')}
        description={t('pages.bioText')}
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
          <Sparkles className="h-4 w-4" /> Cosmétique naturelle · Aromathérapie · Phytothérapie
        </div>
      </PageHeader>

      <section className="section">
        <div className="container">
          {result.items.length === 0 ? (
            <EmptyState
              icon={Leaf}
              title="Bientôt disponible"
              description="Notre gamme bio s’enrichit régulièrement. Demandez-nous les produits naturels qui vous intéressent."
            >
              <Link href="/produits" className={buttonVariants()}>
                Voir le catalogue
              </Link>
            </EmptyState>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{result.total}</span> produit{result.total > 1 ? 's' : ''} bio &amp; naturel{result.total > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {result.items.map((p, i) => (
                  <ProductCard key={p.id} product={toCardData(p)} priority={i < 4} />
                ))}
              </div>
              <Pagination page={result.page} pages={result.pages} basePath="/bio" />
            </>
          )}
        </div>
      </section>
    </>
  );
}
