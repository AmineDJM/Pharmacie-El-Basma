'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, TrendingUp, CornerDownLeft } from 'lucide-react';
import { ProductVisual } from '@/components/ui/product-visual';
import { cn, formatPrice } from '@/lib/utils';

interface SearchResult {
  slug: string;
  name: string;
  brandName: string | null;
  categoryName: string | null;
  price: number;
  accent: string;
  imageUrl: string | null;
}

const POPULAR = ['Anthelios solaire', 'Cicaplast', 'Sérum vitamine C', 'Lipikar', 'Mustela', 'Magnésium'];

export function SearchDialog({
  variant = 'bar',
  className,
}: {
  variant?: 'bar' | 'icon';
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const goToResults = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setOpen(false);
      router.push(`/produits?recherche=${encodeURIComponent(term.trim())}`);
    },
    [router],
  );

  return (
    <>
      {variant === 'bar' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'group flex h-11 w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary',
            className,
          )}
          aria-label="Ouvrir la recherche"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Rechercher un produit, une marque…</span>
          <kbd className="hidden rounded border border-border bg-card px-1.5 py-0.5 text-[0.65rem] font-medium sm:inline-block">
            Ctrl K
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Rechercher"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent',
            className,
          )}
        >
          <Search className="h-[1.15rem] w-[1.15rem]" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Recherche de produits"
            className="relative mt-[8vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-lift animate-fade-up"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToResults(query);
              }}
              className="flex items-center gap-3 border-b border-border px-4"
            >
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une marque, une catégorie…"
                className="h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                autoComplete="off"
                enterKeyHint="search"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                aria-label="Fermer la recherche"
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {query.trim().length < 2 ? (
                <div className="p-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" /> Recherches populaires
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        onClick={() => goToResults(term)}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 && !loading ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  Aucun produit trouvé pour « {query} ». Essayez un autre terme ou contactez-nous.
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/produits/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent"
                      >
                        <ProductVisual
                          name={p.name}
                          accent={p.accent}
                          imageUrl={p.imageUrl}
                          className="h-12 w-12 shrink-0 rounded-lg"
                          sizes="48px"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">{p.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[p.brandName, p.categoryName].filter(Boolean).join(' · ')}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-foreground">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {query.trim().length >= 2 && (
              <button
                onClick={() => goToResults(query)}
                className="flex w-full items-center justify-between border-t border-border bg-secondary/40 px-4 py-3 text-sm font-medium text-primary hover:bg-secondary"
              >
                <span>Voir tous les résultats pour « {query} »</span>
                <CornerDownLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
