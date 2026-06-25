import Link from 'next/link';

export function BrandsMarquee({ brands }: { brands: { name: string; slug: string }[] }) {
  if (!brands.length) return null;
  const row = [...brands, ...brands];
  return (
    <div className="relative overflow-hidden mask-fade-r">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {row.map((b, i) => (
          <Link
            key={`${b.slug}-${i}`}
            href={`/marques/${b.slug}`}
            className="flex h-14 shrink-0 items-center rounded-2xl border border-border bg-card px-6 font-display text-lg font-semibold text-foreground/70 transition-colors hover:border-primary/30 hover:text-primary"
            aria-hidden={i >= brands.length}
            tabIndex={i >= brands.length ? -1 : undefined}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
