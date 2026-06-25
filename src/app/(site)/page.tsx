import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Tag, Sparkles, Star, ShieldCheck, Stethoscope, Truck } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import { MapSection } from '@/components/home/map-section';
import { ProductCarousel } from '@/components/home/product-carousel';
import { BrandsMarquee } from '@/components/home/brands-marquee';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { ProductCard } from '@/components/product/product-card';
import { CategoryCard } from '@/components/cards/category-card';
import { ArticleCard } from '@/components/cards/article-card';
import { ReviewCard } from '@/components/cards/review-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { buttonVariants } from '@/components/ui/button';
import {
  getSettings,
  getFeaturedCategories,
  getFeaturedProducts,
  getBestSellers,
  getPromoProducts,
  getFeaturedBrands,
  getFeaturedReviews,
  getFeaturedArticles,
  getFaqs,
} from '@/lib/data';
import { toCardData } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Parapharmacie El Basma — Boufarik, Blida',
    description:
      'Parapharmacie à Boufarik (Blida) : dermocosmétique, compléments alimentaires, soins bébé, solaire et conseils de pharmaciens. La Roche-Posay, Avène, Bioderma, CeraVe, Mustela…',
    path: '/',
  }),
  title: { absolute: 'Parapharmacie El Basma — Boufarik (Blida) · Dermocosmétique & Conseils santé' },
};

const STATS = [
  { icon: ShieldCheck, label: 'Produits authentiques', value: 'Marques de référence' },
  { icon: Stethoscope, label: 'Conseil pharmacien', value: 'Gratuit & personnalisé' },
  { icon: Star, label: 'Satisfaction client', value: '4,9 / 5' },
  { icon: Truck, label: 'Disponibilité rapide', value: 'Boufarik & Blida' },
];

export default async function HomePage() {
  const [settings, categories, featured, bestSellers, promos, brands, reviews, articles, faqs] =
    await Promise.all([
      getSettings(),
      getFeaturedCategories(),
      getFeaturedProducts(),
      getBestSellers(),
      getPromoProducts(),
      getFeaturedBrands(),
      getFeaturedReviews(),
      getFeaturedArticles(),
      getFaqs(),
    ]);

  return (
    <>
      <Hero whatsapp={settings.whatsapp} />

      {/* Stats / trust */}
      <section className="border-y border-border bg-card/50">
        <div className="container grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Nos univers"
              title="Trouvez le bon soin, rapidement"
              description="Une sélection complète, organisée par besoin, pour prendre soin de toute la famille."
              align="left"
              className="mb-10"
            />
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <RevealItem key={cat.id}>
                <CategoryCard category={cat} />
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-8">
            <Link href="/produits" className={buttonVariants({ variant: 'outline' })}>
              Voir tout le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow={<><Sparkles className="h-3.5 w-3.5" /> Coups de cœur</>}
                title="Produits mis en avant"
                description="Les essentiels recommandés par notre équipe de pharmaciens."
                align="left"
                className="mb-10"
              />
            </Reveal>
            <ProductCarousel products={featured.map(toCardData)} />
          </div>
        </section>
      )}

      {/* Promotions */}
      {promos.length > 0 && (
        <section className="bg-gradient-to-b from-rose-50/60 to-background py-16 dark:from-rose-950/20 sm:py-20">
          <div className="container">
            <Reveal>
              <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <SectionHeading
                  eyebrow={<><Tag className="h-3.5 w-3.5" /> Bons plans</>}
                  title="Promotions du moment"
                  description="Profitez d’offres limitées sur une sélection de produits dermocosmétiques."
                  align="left"
                />
                <Link href="/promotions" className={buttonVariants({ variant: 'primary' })}>
                  Toutes les promos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {promos.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={toCardData(p)} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Marques de confiance"
                title="Les plus grandes marques de parapharmacie"
                align="center"
                className="mb-10 items-center"
              />
            </Reveal>
          </div>
          <BrandsMarquee brands={brands} />
        </section>
      )}

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Plébiscités"
                title="Meilleures ventes"
                description="Les produits préférés de nos clients à Boufarik et dans la région de Blida."
                align="left"
                className="mb-10"
              />
            </Reveal>
            <ProductCarousel products={bestSellers.map(toCardData)} />
          </div>
        </section>
      )}

      {/* Conseils santé */}
      {articles.length > 0 && (
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="container">
            <Reveal>
              <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <SectionHeading
                  eyebrow="Conseils santé"
                  title="Nos conseils & guides bien-être"
                  description="Des articles rédigés par notre équipe pour vous aider à mieux choisir et mieux vivre."
                  align="left"
                />
                <Link href="/conseils-sante" className={buttonVariants({ variant: 'outline' })}>
                  Tous les articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-3">
              {articles.map((a) => (
                <RevealItem key={a.id}>
                  <ArticleCard article={a} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow={<><Star className="h-3.5 w-3.5 fill-current" /> Avis vérifiés</>}
                title="Ils nous font confiance"
                description="La satisfaction et le bien-être de nos clients sont notre première priorité."
                align="center"
                className="mb-10 items-center"
              />
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <RevealItem key={r.id}>
                  <ReviewCard review={r} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section pt-0">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow="Questions fréquentes"
                title="Tout ce que vous devez savoir"
                description="Vous ne trouvez pas votre réponse ? Contactez-nous, notre équipe vous répond avec plaisir."
                align="left"
              />
              <Link href="/faq" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
                Voir toutes les questions <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion items={faqs.slice(0, 6)} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Map */}
      <section className="section pt-0">
        <div className="container">
          <MapSection settings={settings} />
        </div>
      </section>
    </>
  );
}
