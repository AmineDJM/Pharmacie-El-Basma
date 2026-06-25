import Image from 'next/image';
import { getAccent } from '@/lib/visuals';
import { cn } from '@/lib/utils';
import { hashString } from '@/lib/utils';

/**
 * Premium generated product visual (no external image dependency).
 * If an imageUrl is provided (set via the admin), it is rendered with
 * next/image; otherwise an elegant accent-tinted illustration is generated.
 */
function Silhouette({ variant }: { variant: number }) {
  const common = 'stroke-white/80';
  switch (variant % 4) {
    case 0: // Flacon pompe (sérum)
      return (
        <g fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.85" strokeWidth="1.6">
          <rect x="40" y="42" width="40" height="60" rx="9" />
          <rect x="52" y="30" width="16" height="14" rx="3" />
          <rect x="55" y="18" width="10" height="14" rx="3" />
          <line x1="60" y1="58" x2="60" y2="86" className={common} strokeWidth="3" strokeOpacity="0.5" />
        </g>
      );
    case 1: // Pot de crème
      return (
        <g fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.85" strokeWidth="1.6">
          <rect x="34" y="52" width="52" height="48" rx="12" />
          <rect x="40" y="40" width="40" height="14" rx="6" />
          <ellipse cx="60" cy="40" rx="20" ry="5" fill="white" fillOpacity="0.25" />
        </g>
      );
    case 2: // Tube
      return (
        <g fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.85" strokeWidth="1.6">
          <path d="M44 36h32l-4 64a6 6 0 0 1-6 5.6H54a6 6 0 0 1-6-5.6L44 36Z" />
          <rect x="44" y="28" width="32" height="9" rx="3" />
          <rect x="55" y="20" width="10" height="9" rx="2.5" />
        </g>
      );
    default: // Boîte (complément)
      return (
        <g fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.85" strokeWidth="1.6">
          <rect x="38" y="34" width="44" height="66" rx="6" />
          <line x1="38" y1="52" x2="82" y2="52" strokeOpacity="0.55" />
          <line x1="48" y1="64" x2="72" y2="64" strokeOpacity="0.4" />
          <line x1="48" y1="72" x2="66" y2="72" strokeOpacity="0.4" />
        </g>
      );
  }
}

export function ProductVisual({
  name,
  accent,
  imageUrl,
  brandName,
  className,
  sizes,
  priority,
}: {
  name: string;
  accent?: string | null;
  imageUrl?: string | null;
  brandName?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (imageUrl) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={sizes || '(max-width: 768px) 50vw, 25vw'}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  const a = getAccent(accent);
  const variant = hashString(name);

  return (
    <div
      className={cn('relative overflow-hidden', a.gradient, className)}
      role="img"
      aria-label={name}
    >
      {/* Soft light highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(255,255,255,0.45),transparent_60%)]" />
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <Silhouette variant={variant} />
      </svg>
      {brandName && (
        <span className="absolute bottom-2.5 left-0 right-0 text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/85">
          {brandName}
        </span>
      )}
    </div>
  );
}
