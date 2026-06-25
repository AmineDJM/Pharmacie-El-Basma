'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import type { ProductCardData } from '@/lib/types';

export function ProductCarousel({ products }: { products: ProductCardData[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 640), behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-2 sm:flex">
        <button
          onClick={() => scroll(-1)}
          aria-label="Précédent"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Suivant"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[44%] min-w-[160px] shrink-0 snap-start sm:w-[260px]">
            <ProductCard product={p} priority={i < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
