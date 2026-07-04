'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Tag,
  Newspaper,
  Star,
  HelpCircle,
  Mail,
  Send,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { LogoMark } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { label: 'Produits', href: '/admin/produits', icon: Package },
  { label: 'Catégories', href: '/admin/categories', icon: FolderTree },
  { label: 'Marques', href: '/admin/marques', icon: Tag },
  { label: 'Conseils santé', href: '/admin/conseils', icon: Newspaper },
  { label: 'Avis clients', href: '/admin/avis', icon: Star },
  { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Send },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export function AdminShell({
  user,
  unread,
  pendingOrders,
  logout,
  children,
}: {
  user: { name: string; email: string };
  unread: number;
  pendingOrders: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  const badgeFor = (href: string) =>
    href === '/admin/messages' ? unread : href === '/admin/commandes' ? pendingOrders : 0;

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item.href);
        const badge = badgeFor(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-foreground/75 hover:bg-accent hover:text-foreground',
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-[1.15rem] w-[1.15rem]" />
              {item.label}
            </span>
            {badge > 0 && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold', active ? 'bg-white/20' : 'bg-primary text-primary-foreground')}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <LogoMark className="h-8 w-8" />
          <div className="leading-none">
            <p className="font-display text-sm font-bold text-foreground">El Basma</p>
            <p className="text-[0.7rem] text-muted-foreground">Administration</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-t border-border p-3">
          <Link href="/" target="_blank" className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-accent">
            <ExternalLink className="h-[1.15rem] w-[1.15rem]" /> Voir le site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30">
              <LogOut className="h-[1.15rem] w-[1.15rem]" /> Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card p-3 shadow-lift">
            <div className="mb-2 flex items-center justify-between px-2 py-2">
              <span className="font-display font-bold">Administration</span>
              <button onClick={() => setOpen(false)} aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks />
            </div>
            <form action={logout} className="border-t border-border pt-2">
              <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600">
                <LogOut className="h-5 w-5" /> Se déconnecter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex">
              <ExternalLink className="h-4 w-4" /> Site
            </Link>
            <ThemeToggle />
            <div className="hidden items-center gap-2 rounded-xl border border-border px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary dark:bg-primary-100">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
