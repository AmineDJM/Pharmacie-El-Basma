import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ArticleCard } from '@/components/cards/article-card';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { getArticles } from '@/lib/data';
import { getAccent } from '@/lib/visuals';
import { getI18n } from '@/i18n/locale';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Conseils santé & bien-être',
  description:
    'Conseils santé, dermocosmétique, soins bébé, compléments et bien-être, rédigés par l’équipe de la Parapharmacie El Basma à Boufarik (Blida).',
  path: '/conseils-sante',
});

export default async function ConseilsPage() {
  const { t } = await getI18n();
  const articles = await getArticles();
  const [featured, ...rest] = articles;
  const accent = featured ? getAccent(featured.accent) : getAccent('emerald');

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Conseils santé', href: '/conseils-sante' }]}
        eyebrow={t('pages.adviceEyebrow')}
        title={t('pages.adviceTitle')}
        description={t('pages.adviceText')}
      />

      <section className="section">
        <div className="container">
          {featured && (
            <Reveal>
              <Link
                href={`/conseils-sante/${featured.slug}`}
                className="group mb-12 grid overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-2"
              >
                <div className={cn('relative min-h-[220px] overflow-hidden', accent.gradient)}>
                  <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_-10%,rgba(255,255,255,0.5),transparent_55%)]" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                    À la une · {featured.category}
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
                  <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="text-pretty leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {featured.readingTime} min
                    </span>
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                    Lire l’article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <RevealItem key={article.id}>
                <ArticleCard article={article} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
