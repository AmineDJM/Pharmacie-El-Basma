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
import { getI18n } from '@/i18n/locale';
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
  { icon: ShieldCheck, labelKey: 'stats.authenticTitle', valueKey: 'stats.authenticText' },
  { icon: Stethoscope, labelKey: 'stats.adviceTitle', valueKey: 'stats.adviceText' },
  { icon: Star, labelKey: 'stats.satisfactionTitle', value: '4,9 / 5' },
  { icon: Truck, labelKey: 'stats.deliveryTitle', valueKey: 'stats.deliveryText' },
] as const;

export default async function HomePage() {
  const { t } = await getI18n();
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
            <div key={s.labelKey} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{'valueKey' in s ? t(s.valueKey) : s.value}</p>
                <p className="text-xs text-muted-foreground">{t(s.labelKey)}</p>
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
              eyebrow={t('sections.categoriesEyebrow')}
              title={t('sections.categoriesTitle')}
              description={t('sections.categoriesText')}
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
              {t('common.allProducts')} <ArrowRight className="h-4 w-4" />
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
                eyebrow={<><Sparkles className="h-3.5 w-3.5" /> {t('sections.featuredEyebrow')}</>}
                title={t('sections.featuredTitle')}
                description={t('sections.featuredText')}
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
                  eyebrow={<><Tag className="h-3.5 w-3.5" /> {t('sections.promoEyebrow')}</>}
                  title={t('sections.promoTitle')}
                  description={t('sections.promoText')}
                  align="left"
                />
                <Link href="/promotions" className={buttonVariants({ variant: 'primary' })}>
                  {t('sections.promoAll')} <ArrowRight className="h-4 w-4" />
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
                eyebrow={t('sections.brandsEyebrow')}
                title={t('sections.brandsTitle')}
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
                eyebrow={t('sections.bestEyebrow')}
                title={t('sections.bestTitle')}
                description={t('sections.bestText')}
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
                  eyebrow={t('sections.adviceEyebrow')}
                  title={t('sections.adviceTitle')}
                  description={t('sections.adviceText')}
                  align="left"
                />
                <Link href="/conseils-sante" className={buttonVariants({ variant: 'outline' })}>
                  {t('sections.adviceAll')} <ArrowRight className="h-4 w-4" />
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
                eyebrow={<><Star className="h-3.5 w-3.5 fill-current" /> {t('sections.reviewsEyebrow')}</>}
                title={t('sections.reviewsTitle')}
                description={t('sections.reviewsText')}
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
                eyebrow={t('sections.faqEyebrow')}
                title={t('sections.faqTitle')}
                description={t('sections.faqText')}
                align="left"
              />
              <Link href="/faq" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
                {t('sections.faqAll')} <ArrowRight className="h-4 w-4" />
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
