import { getCategoryTree, getFeaturedBrands, getSettings } from '@/lib/data';
import { Header } from './header';
import type { NavCategory } from '@/lib/types';

/** Server wrapper: fetches navigation data and hands it to the client header. */
export async function SiteHeader() {
  const [tree, brands, settings] = await Promise.all([
    getCategoryTree(),
    getFeaturedBrands(),
    getSettings(),
  ]);

  const categories: NavCategory[] = tree.map((c) => ({
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    accent: c.accent,
    count:
      (c._count?.products ?? 0) +
      c.children.reduce((sum, ch) => sum + (ch._count?.products ?? 0), 0),
    children: c.children.map((ch) => ({
      name: ch.name,
      slug: ch.slug,
      count: ch._count?.products ?? 0,
    })),
  }));

  return (
    <Header
      categories={categories}
      brands={brands.map((b) => ({ name: b.name, slug: b.slug, accent: b.accent }))}
      settings={{
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        announcement: settings.announcement,
        announcementActive: settings.announcementActive,
      }}
    />
  );
}
