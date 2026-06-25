import Link from 'next/link';
import { Star, ShieldCheck, MessageCircle, ArrowRight, MapPin, Sparkles, Heart } from 'lucide-react';
import { SearchDialog } from '@/components/search/search-dialog';
import { ProductVisual } from '@/components/ui/product-visual';
import { buttonVariants } from '@/components/ui/button';
import { whatsappLink } from '@/lib/utils';

export function Hero({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/70 via-background to-background dark:from-primary-50/20" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-teal-400/15 blur-[110px]" />
        <div className="absolute inset-0 bg-grid-pattern bg-[size:42px_42px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-100 dark:text-primary-900">
            <MapPin className="h-3.5 w-3.5" /> Parapharmacie à Boufarik · Wilaya de Blida
          </span>

          <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Votre santé et votre beauté,{' '}
            <span className="text-gradient">entre de bonnes mains</span>
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Dermocosmétique, compléments alimentaires, soins bébé et conseils de professionnels.
            La Parapharmacie El Basma met l’expertise et les plus grandes marques à votre portée, à Boufarik.
          </p>

          <div className="w-full max-w-md">
            <SearchDialog variant="bar" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/produits" className={buttonVariants({ size: 'lg' })}>
              Découvrir les produits
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(whatsapp, 'Bonjour, je souhaite un conseil / vérifier une disponibilité.')}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              Conseil sur WhatsApp
            </a>
          </div>

          {/* Trust */}
          <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4,9/5</span>
              <span className="text-muted-foreground">· avis clients</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Produits authentiques
            </div>
          </div>
        </div>

        {/* Visual collage */}
        <div className="relative mx-auto hidden h-[480px] w-full max-w-md lg:block">
          <div className="absolute left-1/2 top-1/2 h-[105%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-gradient-to-br from-card to-secondary shadow-card" />

          {/* Main product card */}
          <div className="absolute left-6 top-10 w-56 rotate-[-4deg] overflow-hidden rounded-3xl border border-border bg-card shadow-lift animate-float">
            <ProductVisual name="Sérum Hyalu B5" accent="sky" brandName="La Roche-Posay" className="aspect-square w-full" />
            <div className="p-3">
              <p className="text-xs font-semibold text-primary/80">Sérum repulpant</p>
              <p className="text-sm font-semibold">Hyalu B5</p>
              <p className="mt-1 text-sm font-bold">4 100 DA</p>
            </div>
          </div>

          {/* Secondary product card */}
          <div className="absolute bottom-8 right-4 w-44 rotate-[5deg] overflow-hidden rounded-3xl border border-border bg-card shadow-lift animate-float [animation-delay:-2s]">
            <ProductVisual name="Anthelios SPF50" accent="amber" brandName="Avène" className="aspect-square w-full" />
            <div className="p-3">
              <p className="text-xs font-semibold text-primary/80">Solaire SPF50+</p>
              <p className="text-sm font-bold">2 690 DA</p>
            </div>
          </div>

          {/* Review chip */}
          <div className="absolute right-2 top-6 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2 shadow-lift backdrop-blur animate-float [animation-delay:-1s]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <div className="text-xs">
              <p className="font-semibold">Excellent conseil</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Availability chip */}
          <div className="absolute bottom-24 left-0 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2 shadow-lift backdrop-blur animate-float [animation-delay:-3s]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
            <span className="text-xs font-semibold">Disponibilité en 1 clic</span>
          </div>

          {/* Brand sparkle */}
          <div className="absolute -top-2 left-24 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white shadow-glow animate-float [animation-delay:-1.5s]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
