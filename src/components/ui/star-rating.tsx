import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  rating,
  count,
  size = 'sm',
  className,
}: {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const dim = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const full = Math.round(rating);
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(dim, i < full ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
        {typeof count === 'number' && count > 0 && <span className="ml-1 opacity-70">({count})</span>}
      </span>
    </div>
  );
}
