import Link from 'next/link';
import { Tag, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ProductCard } from '@/components/product/product-card';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { getProducts } from '@/lib/data';
import { toCardData } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Promotions & offres parapharmacie',
  description:
    'Profitez des promotions en cours à la Parapharmacie El Basma de Boufarik : réductions sur la dermocosmétique, les compléments alimentaires, les soins solaires et bien plus.',
  path: '/promotions',
});

type SP = Promise<Record<string, string | undefined>>;

export default async function PromotionsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const result = await getProducts({ promo: true, sort: 'recent', page, perPage: 12 });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Promotions', href: '/promotions' }]}
        eyebrow={<><Tag className="h-3.5 w-3.5" /> Bons plans</>}
        title="Nos promotions du moment"
        description="Des prix doux sur une sélection de produits de qualité, renouvelée régulièrement."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
          <Sparkles className="h-4 w-4" /> Jusqu’à −30 % sur une sélection dermocosmétique
        </div>
      </PageHeader>

      <section className="section">
        <div className="container">
          {result.items.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="Pas de promotion en cours"
              description="Revenez bientôt ! De nouvelles offres sont publiées régulièrement. Inscrivez-vous à la newsletter pour être informé(e)."
            >
              <Link href="/produits" className={buttonVariants()}>
                Voir le catalogue
              </Link>
            </EmptyState>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{result.total}</span> produit{result.total > 1 ? 's' : ''} en promotion
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {result.items.map((p, i) => (
                  <ProductCard key={p.id} product={toCardData(p)} priority={i < 4} />
                ))}
              </div>
              <Pagination page={result.page} pages={result.pages} basePath="/promotions" />
            </>
          )}
        </div>
      </section>
    </>
  );
}
