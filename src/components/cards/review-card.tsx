import { Quote } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

export function ReviewCard({
  review,
  className,
}: {
  review: { author: string; rating: number; content: string; source: string; location: string };
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} size="md" />
        <Quote className="h-6 w-6 text-primary/20" aria-hidden />
      </div>
      <blockquote className="flex-1 text-pretty leading-relaxed text-foreground/90">
        “{review.content}”
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 font-semibold text-primary-700 dark:bg-primary-100 dark:text-primary-900">
          {review.author.charAt(0)}
        </div>
        <div className="text-sm">
          <p className="font-semibold text-foreground">{review.author}</p>
          <p className="text-xs text-muted-foreground">
            {review.location} · Avis {review.source}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
