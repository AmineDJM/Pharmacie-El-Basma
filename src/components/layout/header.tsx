'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Heart,
  Scale,
  ShoppingBag,
  ChevronDown,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SearchDialog } from '@/components/search/search-dialog';
import { CategoryIcon } from '@/components/ui/category-icon';
import { useStore } from '@/components/providers/store-provider';
import { useT } from '@/i18n/provider';
import { LanguageSwitcher } from '@/i18n/language-switcher';
import { MAIN_NAV } from '@/lib/constants';
import { getAccent } from '@/lib/visuals';
import { cn, whatsappLink, telLink } from '@/lib/utils';
import type { NavCategory } from '@/lib/types';

interface HeaderProps {
  categories: NavCategory[];
  brands: { name: string; slug: string; accent: string }[];
  settings: { phone: string; whatsapp: string; announcement: string; announcementActive: boolean };
}

export function Header({ categories, brands, settings }: HeaderProps) {
  const pathname = usePathname();
  const t = useT();
  const { favorites, compare, cartCount, ready } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setDismissed(localStorage.getItem('elbasma:announce-dismissed') === '1');
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const showAnnounce = settings.announcementActive && settings.announcement && !dismissed;

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      {showAnnounce && (
        <div className="relative bg-primary text-primary-foreground">
          <div className="container flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
            <Sparkles className="hidden h-4 w-4 sm:inline" aria-hidden />
            <p className="text-balance">{settings.announcement}</p>
            <button
              onClick={() => {
                setDismissed(true);
                localStorage.setItem('elbasma:announce-dismissed', '1');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/15"
              aria-label="Masquer l'annonce"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          'border-b border-border/80 bg-background/85 backdrop-blur-xl transition-shadow',
          scrolled && 'shadow-soft',
        )}
      >
        <div className="container flex h-16 items-center gap-4 lg:h-[4.5rem]">
          <Logo className="shrink-0" />

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
            {MAIN_NAV.map((item) =>
              item.key === 'products' ? (
                <div key={item.href} className="relative">
                  <button
                    onMouseEnter={openMega}
                    onClick={() => setMegaOpen((v) => !v)}
                    aria-expanded={megaOpen}
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      megaOpen || pathname.startsWith('/produits') || pathname.startsWith('/categories')
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-foreground',
                    )}
                  >
                    {t(`nav.${item.key}`)}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', megaOpen && 'rotate-180')} />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setMegaOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href ? 'text-primary' : 'text-foreground/80 hover:text-foreground',
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ),
            )}
          </nav>

          {/* Search (desktop) */}
          <div className="ml-auto hidden max-w-xs flex-1 md:block lg:max-w-sm">
            <SearchDialog variant="bar" placeholder={t('common.searchPlaceholder')} />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5 md:ml-2">
            <div className="md:hidden">
              <SearchDialog variant="icon" placeholder={t('common.searchPlaceholder')} />
            </div>
            <Link
              href="/favoris"
              aria-label={t('nav.favorites')}
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              <Heart className="h-[1.15rem] w-[1.15rem]" />
              {ready && favorites.length > 0 && <CountBadge n={favorites.length} />}
            </Link>
            <Link
              href="/comparateur"
              aria-label={t('nav.compare')}
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              <Scale className="h-[1.15rem] w-[1.15rem]" />
              {ready && compare.length > 0 && <CountBadge n={compare.length} />}
            </Link>
            <Link
              href="/panier"
              aria-label={t('nav.cart')}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {ready && cartCount > 0 && <CountBadge n={cartCount} />}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle className="hidden sm:inline-flex" />
            <a
              href={telLink(settings.phone)}
              className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-600 hover:shadow-glow xl:inline-flex"
            >
              <Phone className="h-4 w-4" /> {t('common.call')}
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            className="absolute inset-x-0 top-full hidden border-b border-border bg-card/95 shadow-lift backdrop-blur-xl lg:block animate-fade-in"
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
          >
            <div className="container grid grid-cols-12 gap-6 py-8">
              <div className="col-span-9 grid grid-cols-4 gap-x-6 gap-y-7">
                {categories.map((cat) => {
                  const a = getAccent(cat.accent);
                  return (
                    <div key={cat.slug}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="mb-2.5 flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-lg text-white', a.gradient)}>
                          <CategoryIcon name={cat.icon} className="h-4 w-4" />
                        </span>
                        {cat.name}
                      </Link>
                      <ul className="space-y-1.5 border-l border-border pl-3">
                        {cat.children.slice(0, 6).map((child) => (
                          <li key={child.slug}>
                            <Link
                              href={`/categories/${child.slug}`}
                              className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Featured rail */}
              <div className="col-span-3 flex flex-col gap-4 border-l border-border pl-6">
                <Link
                  href="/promotions"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-5 text-primary-foreground"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Offres du moment</p>
                  <p className="mt-1 font-display text-lg font-bold">Jusqu’à −30 %</p>
                  <p className="mt-1 text-sm opacity-90">Sur une sélection dermocosmétique</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                    Voir les promotions
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Marques populaires
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.slice(0, 8).map((b) => (
                      <Link
                        key={b.slug}
                        href={`/marques/${b.slug}`}
                        className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-card shadow-lift animate-fade-in">
            <div className="flex items-center justify-between border-b border-border p-4">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu" className="rounded-lg p-2 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              {MAIN_NAV.filter((i) => i.key !== 'products').map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === item.href ? 'bg-primary-50 text-primary dark:bg-primary-100' : 'hover:bg-accent',
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}

              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catégories
              </p>
              {categories.map((cat) => (
                <details key={cat.slug} className="group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent">
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className={cn('h-4 w-4', getAccent(cat.accent).text)} />
                      {cat.name}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="ml-9 space-y-1 border-l border-border pb-2 pl-3">
                    <li>
                      <Link href={`/categories/${cat.slug}`} className="block py-1.5 text-sm font-medium text-primary">
                        Tout voir
                      </Link>
                    </li>
                    {cat.children.map((child) => (
                      <li key={child.slug}>
                        <Link href={`/categories/${child.slug}`} className="block py-1.5 text-sm text-muted-foreground">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-border p-4">
              <Link href="/panier" className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                <ShoppingBag className="h-4 w-4" /> {t('nav.cart')} {ready && cartCount > 0 && `(${cartCount})`}
              </Link>
              <div className="flex gap-2">
                <Link href="/favoris" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium">
                  <Heart className="h-4 w-4" /> {t('nav.favorites')} {ready && favorites.length > 0 && `(${favorites.length})`}
                </Link>
                <Link href="/comparateur" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium">
                  <Scale className="h-4 w-4" /> {t('nav.compare')} {ready && compare.length > 0 && `(${compare.length})`}
                </Link>
              </div>
              <div className="flex gap-2">
                <a href={telLink(settings.phone)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                  <Phone className="h-4 w-4" /> {t('common.call')}
                </a>
                <a
                  href={whatsappLink(settings.whatsapp, 'Bonjour, je vous contacte depuis votre site.')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-muted-foreground">Thème</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CountBadge({ n }: { n: number }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
      {n}
    </span>
  );
}
