'use client';

import { useState } from 'react';
import { ProductVisual } from '@/components/ui/product-visual';
import { cn } from '@/lib/utils';

export function ProductGallery({
  name,
  accent,
  images,
  brandName,
}: {
  name: string;
  accent?: string | null;
  images: string[];
  brandName?: string | null;
}) {
  const [selected, setSelected] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <ProductVisual
          name={name}
          accent={accent}
          imageUrl={hasImages ? images[selected] : null}
          brandName={brandName}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-square w-full"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={cn(
                'overflow-hidden rounded-xl border-2 transition-colors',
                i === selected ? 'border-primary' : 'border-border hover:border-primary/40',
              )}
            >
              <ProductVisual name={name} accent={accent} imageUrl={img} className="aspect-square w-full" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
