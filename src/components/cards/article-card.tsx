import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { getAccent } from '@/lib/visuals';
import { cn, formatDate } from '@/lib/utils';

export function ArticleCard({
  article,
  className,
}: {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    accent: string;
    readingTime: number;
    publishedAt: Date | string;
  };
  className?: string;
}) {
  const a = getAccent(article.accent);
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <Link href={`/conseils-sante/${article.slug}`} className="block">
        <div className={cn('relative h-40 overflow-hidden', a.gradient)}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_-10%,rgba(255,255,255,0.5),transparent_55%)]" />
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
              {article.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-foreground">
          <Link href={`/conseils-sante/${article.slug}`} className="transition-colors hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {article.readingTime} min · {formatDate(article.publishedAt)}
          </span>
          <Link
            href={`/conseils-sante/${article.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-primary"
            aria-label={`Lire : ${article.title}`}
          >
            Lire <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
