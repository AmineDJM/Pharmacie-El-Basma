import Link from 'next/link';
import {
  Package,
  FolderTree,
  Tag,
  Newspaper,
  Star,
  Mail,
  Send,
  Plus,
  ArrowRight,
  Inbox,
  ShoppingCart,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatDate, formatPrice, cn } from '@/lib/utils';
import { orderStatusMeta } from '@/lib/orders';

export default async function AdminDashboard() {
  let counts = { products: 0, categories: 0, brands: 0, articles: 0, reviews: 0, unread: 0, subscribers: 0, orders: 0, pendingOrders: 0 };
  let recentMessages: { id: string; name: string; subject: string; createdAt: Date; read: boolean }[] = [];
  let recentOrders: { id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: Date }[] = [];

  try {
    const [products, categories, brands, articles, reviews, unread, subscribers, orders, pendingOrders, messages, orderList] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.brand.count(),
        prisma.article.count(),
        prisma.review.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.newsletterSubscriber.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'pending' } }),
        prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
      ]);
    counts = { products, categories, brands, articles, reviews, unread, subscribers, orders, pendingOrders };
    recentMessages = messages;
    recentOrders = orderList;
  } catch {
    /* db unavailable */
  }

  const stats = [
    { label: 'Commandes en attente', value: counts.pendingOrders, icon: ShoppingCart, href: '/admin/commandes?statut=pending', accent: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Produits', value: counts.products, icon: Package, href: '/admin/produits', accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Catégories', value: counts.categories, icon: FolderTree, href: '/admin/categories', accent: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
    { label: 'Marques', value: counts.brands, icon: Tag, href: '/admin/marques', accent: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
    { label: 'Articles', value: counts.articles, icon: Newspaper, href: '/admin/conseils', accent: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
    { label: 'Avis', value: counts.reviews, icon: Star, href: '/admin/avis', accent: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Messages non lus', value: counts.unread, icon: Mail, href: '/admin/messages', accent: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    { label: 'Abonnés', value: counts.subscribers, icon: Send, href: '/admin/newsletter', accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
  ];

  const quickActions = [
    { label: 'Voir les commandes', href: '/admin/commandes', icon: ShoppingCart },
    { label: 'Ajouter un produit', href: '/admin/produits/nouveau', icon: Package },
    { label: 'Écrire un article', href: '/admin/conseils/nouveau', icon: Newspaper },
    { label: 'Modifier les paramètres', href: '/admin/parametres', icon: Tag },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Bienvenue 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez l’ensemble de votre site depuis cet espace : produits, contenus, avis et messages.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.accent}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Dernières commandes</h2>
          <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8" />
            <p className="text-sm">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentOrders.map((o) => {
              const meta = orderStatusMeta(o.status);
              return (
                <li key={o.id}>
                  <Link href={`/admin/commandes/${o.id}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary">
                    <span className="min-w-0">
                      <span className="font-medium text-foreground">{o.orderNumber}</span>
                      <span className="block truncate text-sm text-muted-foreground">{o.customerName}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{formatPrice(o.total)}</span>
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', meta.className)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
                        {meta.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent messages */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Derniers messages</h2>
            <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <Inbox className="h-8 w-8" />
              <p className="text-sm">Aucun message pour le moment.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentMessages.map((m) => (
                <li key={m.id}>
                  <Link href="/admin/messages" className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        <span className="truncate font-medium text-foreground">{m.name}</span>
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">{m.subject}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Actions rapides</h2>
          <div className="flex flex-col gap-2">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-accent">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-100">
                  <Plus className="h-4 w-4" />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
