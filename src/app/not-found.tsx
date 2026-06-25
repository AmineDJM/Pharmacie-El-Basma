import Link from 'next/link';
import { Home, Search, Phone, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-background dark:from-primary-50/10" />
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
      </div>

      <header className="container py-6">
        <Logo />
      </header>

      <main className="container flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="font-display text-[6rem] font-extrabold leading-none text-gradient sm:text-[8rem]">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Cette page semble introuvable
        </h1>
        <p className="mt-3 max-w-md text-pretty text-muted-foreground">
          La page que vous recherchez a peut-être été déplacée ou n’existe plus. Retrouvez votre chemin
          parmi nos produits et conseils santé.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: 'lg' })}>
            <Home className="h-5 w-5" /> Retour à l’accueil
          </Link>
          <Link href="/produits" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            <Search className="h-5 w-5" /> Voir les produits
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/conseils-sante" className="hover:text-primary">Conseils santé</Link>
          <Link href="/promotions" className="hover:text-primary">Promotions</Link>
          <Link href="/contact" className="inline-flex items-center gap-1.5 hover:text-primary">
            <Phone className="h-3.5 w-3.5" /> Contact
          </Link>
        </div>

        <Link href="/" className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          <ArrowLeft className="h-4 w-4" /> Revenir en lieu sûr
        </Link>
      </main>
    </div>
  );
}
