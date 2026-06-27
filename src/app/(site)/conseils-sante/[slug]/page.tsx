import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, Calendar, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Markdown } from '@/components/ui/markdown';
import { ArticleCard } from '@/components/cards/article-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { getArticleBySlug, getArticles, getSettings } from '@/lib/data';
import { getI18n } from '@/i18n/locale';
import { localize } from '@/lib/localize';
import { buildMetadata, articleSchema, breadcrumbSchema } from '@/lib/seo';
import { getAccent } from '@/lib/visuals';
import { cn, formatDate, whatsappLink } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published)
    return buildMetadata({ title: 'Article introuvable', description: '', path: `/conseils-sante/${slug}`, noindex: true });
  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    path: `/conseils-sante/${article.slug}`,
    type: 'article',
    publishedTime: new Date(article.publishedAt).toISOString(),
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const [all, settings] = await Promise.all([getArticles(), getSettings()]);
  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3);
  const accent = getAccent(article.accent);
  const { locale, t } = await getI18n();
  const la = localize(article, locale, ['title', 'excerpt']);

  return (
    <>
      <article>
        {/* Hero */}
        <header className={cn('relative overflow-hidden border-b border-border', accent.soft)}>
          <div className="container py-8 sm:py-12">
            <Breadcrumbs
              items={[
                { label: t('nav.advice'), href: '/conseils-sante' },
                { label: la.title, href: `/conseils-sante/${article.slug}` },
              ]}
            />
            <div className="mt-6 max-w-3xl">
              <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white', accent.gradient)}>
                {article.category}
              </span>
              <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {la.title}
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{la.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {article.author}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(article.publishedAt)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_18rem]">
          <div className="mx-auto w-full max-w-3xl">
            <Markdown content={article.content} />

            <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Une question sur ce sujet ?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Nos pharmaciens à Boufarik vous conseillent avec plaisir, en boutique ou sur WhatsApp.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(settings.whatsapp, `Bonjour, j’ai une question suite à votre article : ${article.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'whatsapp' })}
                >
                  <MessageCircle className="h-4 w-4" /> Poser ma question
                </a>
                <Link href="/conseils-sante" className={buttonVariants({ variant: 'outline' })}>
                  <ArrowLeft className="h-4 w-4" /> Tous les conseils
                </Link>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">À retenir</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                Cet article a une vocation informative et ne remplace pas l’avis d’un professionnel de santé.
                Pour toute situation particulière, demandez conseil à votre pharmacien ou votre médecin.
              </p>
            </div>
          </aside>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-secondary/40 pt-12">
          <div className="container">
            <SectionHeading eyebrow="À lire aussi" title="Autres conseils" align="left" className="mb-8" />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { label: 'Accueil', href: '/' },
            { label: 'Conseils santé', href: '/conseils-sante' },
            { label: article.title, href: `/conseils-sante/${article.slug}` },
          ]),
        ]}
      />
    </>
  );
}
