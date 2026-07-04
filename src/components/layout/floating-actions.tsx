'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowUp, Scale, X, ShoppingBag } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { whatsappLink, cn } from '@/lib/utils';

export function FloatingActions({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  void phone;
  const { compare, clearCompare, cartCount, ready } = useStore();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Compare bar */}
      {ready && compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 animate-fade-up">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-lift backdrop-blur-xl">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {compare.length} produit{compare.length > 1 ? 's' : ''} à comparer
            </span>
            <Link
              href="/comparateur"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-600"
            >
              Comparer
            </Link>
            <button onClick={clearCompare} aria-label="Vider le comparateur" className="rounded-lg p-1 text-muted-foreground hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Remonter en haut"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-all hover:bg-accent',
            showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        {ready && cartCount > 0 && (
          <Link
            href="/panier"
            aria-label="Voir mon panier"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lift transition-transform hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
              {cartCount}
            </span>
          </Link>
        )}

        <a
          href={whatsappLink(whatsapp, 'Bonjour, je vous contacte depuis le site de la Parapharmacie El Basma.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nous contacter sur WhatsApp"
          className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 font-semibold text-white shadow-lift transition-transform hover:scale-105"
        >
          <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full bg-[#25D366] opacity-20" aria-hidden />
          <MessageCircle className="h-6 w-6" />
          <span className="hidden text-sm sm:inline">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
