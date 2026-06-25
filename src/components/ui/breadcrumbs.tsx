import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/seo';

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Accueil', href: '/' }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Fil d'Ariane" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          {all.map((crumb, i) => {
            const last = i === all.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden />}
                {last ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                )}
                {!last && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
