'use server';

import { redirect } from 'next/navigation';
import { revalidateTag, revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { authenticate, createSession, destroySession, hashPassword } from '@/lib/auth';
import { TAGS } from '@/lib/data';
import { slugify } from '@/lib/utils';
import type { FormState } from './public';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  return user;
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
const num = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? '').replace(',', '.').trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const int = (fd: FormData, key: string) => Math.round(num(fd, key));
const bool = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return v === 'on' || v === 'true' || v === '1';
};
const optNum = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? '').replace(',', '.').trim();
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const optStr = (fd: FormData, key: string) => str(fd, key) || null;

/** Parse a JSON array of image URLs submitted by the gallery uploader. */
function readImages(fd: FormData, key: string): string[] {
  try {
    const parsed = JSON.parse(str(fd, key) || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
  } catch {
    return [];
  }
}

/** Build a translations JSON ({ en:{...}, ar:{...} }) from tr_<locale>_<field> inputs. */
function readTranslations(formData: FormData, fields: string[]): Prisma.InputJsonValue | undefined {
  const out: Record<string, Record<string, string>> = {};
  for (const loc of ['en', 'ar']) {
    const obj: Record<string, string> = {};
    for (const f of fields) {
      const v = str(formData, `tr_${loc}_${f}`);
      if (v) obj[f] = v;
    }
    if (Object.keys(obj).length) out[loc] = obj;
  }
  return Object.keys(out).length ? (out as Prisma.InputJsonValue) : undefined;
}

async function uniqueSlug(
  finder: (slug: string) => Promise<{ id: string } | null>,
  base: string,
  excludeId?: string,
) {
  const root = slugify(base) || 'element';
  let slug = root;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await finder(slug);
    if (!existing || existing.id === excludeId) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

function revalidateAll(...tags: string[]) {
  for (const tag of tags) revalidateTag(tag);
  revalidatePath('/', 'layout');
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = str(formData, 'email').toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { ok: false, message: 'Veuillez renseigner vos identifiants.' };

  const user = await authenticate(email, password);
  if (!user) return { ok: false, message: 'E-mail ou mot de passe incorrect.' };

  await createSession(user);
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const name = str(formData, 'name');
  const categoryId = str(formData, 'categoryId');
  if (!name) return { ok: false, message: 'Le nom du produit est obligatoire.' };
  if (!categoryId) return { ok: false, message: 'Veuillez choisir une catégorie.' };

  const slug = await uniqueSlug((s) => prisma.product.findUnique({ where: { slug: s } }), str(formData, 'slug') || name, id ?? undefined);

  const images = readImages(formData, 'images');

  const data = {
    name,
    slug,
    shortDescription: str(formData, 'shortDescription') || name,
    description: str(formData, 'description') || str(formData, 'shortDescription') || name,
    price: num(formData, 'price'),
    oldPrice: optNum(formData, 'oldPrice'),
    images,
    imageUrl: images[0] ?? null,
    inStock: bool(formData, 'inStock'),
    isFeatured: bool(formData, 'isFeatured'),
    isNew: bool(formData, 'isNew'),
    isBestSeller: bool(formData, 'isBestSeller'),
    isBio: bool(formData, 'isBio'),
    translations: readTranslations(formData, ['name', 'shortDescription', 'description']),
    rating: optNum(formData, 'rating') ?? 4.8,
    reviewCount: int(formData, 'reviewCount'),
    highlights: optStr(formData, 'highlights'),
    categoryId,
    brandId: optStr(formData, 'brandId'),
    metaTitle: optStr(formData, 'metaTitle'),
    metaDescription: optStr(formData, 'metaDescription'),
  };

  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });

  revalidateAll(TAGS.products);
  redirect('/admin/produits');
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.product.delete({ where: { id } });
  revalidateAll(TAGS.products);
  revalidatePath('/admin/produits');
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'cancelled'] as const;

export async function updateOrderStatus(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  const status = str(formData, 'status');
  if (!id || !(ORDER_STATUSES as readonly string[]).includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/admin/commandes');
  revalidatePath(`/admin/commandes/${id}`);
}

export async function deleteOrder(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.order.delete({ where: { id } });
  revalidatePath('/admin/commandes');
  redirect('/admin/commandes');
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const name = str(formData, 'name');
  if (!name) return { ok: false, message: 'Le nom de la catégorie est obligatoire.' };

  const slug = await uniqueSlug((s) => prisma.category.findUnique({ where: { slug: s } }), str(formData, 'slug') || name, id ?? undefined);
  const parentId = optStr(formData, 'parentId');

  const data = {
    name,
    slug,
    description: optStr(formData, 'description'),
    icon: optStr(formData, 'icon'),
    accent: str(formData, 'accent') || 'emerald',
    translations: readTranslations(formData, ['name', 'description']),
    parentId: parentId === id ? null : parentId,
    order: int(formData, 'order'),
    featured: bool(formData, 'featured'),
    metaTitle: optStr(formData, 'metaTitle'),
    metaDescription: optStr(formData, 'metaDescription'),
  };

  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });

  revalidateAll(TAGS.categories, TAGS.products);
  redirect('/admin/categories');
}

export async function deleteCategory(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.category.delete({ where: { id } });
  revalidateAll(TAGS.categories, TAGS.products);
  revalidatePath('/admin/categories');
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function saveBrand(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const name = str(formData, 'name');
  if (!name) return { ok: false, message: 'Le nom de la marque est obligatoire.' };

  const slug = await uniqueSlug((s) => prisma.brand.findUnique({ where: { slug: s } }), str(formData, 'slug') || name, id ?? undefined);

  const data = {
    name,
    slug,
    description: optStr(formData, 'description'),
    accent: str(formData, 'accent') || 'teal',
    featured: bool(formData, 'featured'),
    order: int(formData, 'order'),
    metaTitle: optStr(formData, 'metaTitle'),
    metaDescription: optStr(formData, 'metaDescription'),
  };

  if (id) await prisma.brand.update({ where: { id }, data });
  else await prisma.brand.create({ data });

  revalidateAll(TAGS.brands, TAGS.products);
  redirect('/admin/marques');
}

export async function deleteBrand(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.brand.delete({ where: { id } });
  revalidateAll(TAGS.brands, TAGS.products);
  revalidatePath('/admin/marques');
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function saveArticle(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const title = str(formData, 'title');
  if (!title) return { ok: false, message: 'Le titre de l’article est obligatoire.' };

  const slug = await uniqueSlug((s) => prisma.article.findUnique({ where: { slug: s } }), str(formData, 'slug') || title, id ?? undefined);

  const data = {
    title,
    slug,
    excerpt: str(formData, 'excerpt') || title,
    content: str(formData, 'content'),
    category: str(formData, 'category') || 'Conseils santé',
    author: str(formData, 'author') || 'Équipe Parapharmacie El Basma',
    readingTime: int(formData, 'readingTime') || 4,
    accent: str(formData, 'accent') || 'emerald',
    translations: readTranslations(formData, ['title', 'excerpt', 'content']),
    published: bool(formData, 'published'),
    featured: bool(formData, 'featured'),
    metaTitle: optStr(formData, 'metaTitle'),
    metaDescription: optStr(formData, 'metaDescription'),
  };

  if (id) await prisma.article.update({ where: { id }, data });
  else await prisma.article.create({ data });

  revalidateAll(TAGS.articles);
  redirect('/admin/conseils');
}

export async function deleteArticle(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.article.delete({ where: { id } });
  revalidateAll(TAGS.articles);
  revalidatePath('/admin/conseils');
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function saveReview(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const author = str(formData, 'author');
  const content = str(formData, 'content');
  if (!author || !content) return { ok: false, message: 'Le nom et le texte de l’avis sont obligatoires.' };

  const data = {
    author,
    content,
    rating: Math.min(5, Math.max(1, int(formData, 'rating') || 5)),
    source: str(formData, 'source') || 'Google',
    location: str(formData, 'location') || 'Boufarik',
    approved: bool(formData, 'approved'),
    featured: bool(formData, 'featured'),
  };

  if (id) await prisma.review.update({ where: { id }, data });
  else await prisma.review.create({ data });

  revalidateAll(TAGS.reviews);
  redirect('/admin/avis');
}

export async function deleteReview(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.review.delete({ where: { id } });
  revalidateAll(TAGS.reviews);
  revalidatePath('/admin/avis');
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export async function saveFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const question = str(formData, 'question');
  const answer = str(formData, 'answer');
  if (!question || !answer) return { ok: false, message: 'La question et la réponse sont obligatoires.' };

  const data = {
    question,
    answer,
    category: str(formData, 'category') || 'Général',
    order: int(formData, 'order'),
    published: bool(formData, 'published'),
    translations: readTranslations(formData, ['question', 'answer']),
  };

  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });

  revalidateAll(TAGS.faqs);
  redirect('/admin/faq');
}

export async function deleteFaq(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.faq.delete({ where: { id } });
  revalidateAll(TAGS.faqs);
  revalidatePath('/admin/faq');
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function toggleMessageRead(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  const read = bool(formData, 'read');
  if (id) await prisma.contactMessage.update({ where: { id }, data: { read: !read } });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function deleteSubscriber(formData: FormData) {
  await requireAuth();
  const id = str(formData, 'id');
  if (id) await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath('/admin/newsletter');
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();

  const openingHours = str(formData, 'openingHours')
    .split('\n')
    .map((line) => {
      const [day, hours] = line.split('|');
      return day && hours ? { day: day.trim(), hours: hours.trim() } : null;
    })
    .filter(Boolean);

  const data = {
    pharmacyName: str(formData, 'pharmacyName') || 'Parapharmacie El Basma',
    tagline: str(formData, 'tagline'),
    description: str(formData, 'description'),
    phone: str(formData, 'phone'),
    whatsapp: str(formData, 'whatsapp').replace(/[^0-9]/g, ''),
    email: str(formData, 'email'),
    addressLine: str(formData, 'addressLine'),
    city: str(formData, 'city'),
    wilaya: str(formData, 'wilaya'),
    country: str(formData, 'country') || 'Algérie',
    postalCode: str(formData, 'postalCode'),
    latitude: num(formData, 'latitude'),
    longitude: num(formData, 'longitude'),
    openingHours: JSON.stringify(openingHours),
    facebookUrl: str(formData, 'facebookUrl'),
    instagramUrl: str(formData, 'instagramUrl'),
    announcement: str(formData, 'announcement'),
    announcementActive: bool(formData, 'announcementActive'),
    mapsUrl: str(formData, 'mapsUrl'),
  };

  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  });

  revalidateAll(TAGS.settings);
  return { ok: true, message: 'Paramètres enregistrés avec succès.' };
}

// ---------------------------------------------------------------------------
// Comptes administrateurs
// ---------------------------------------------------------------------------

export async function saveAdminUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = optStr(formData, 'id');
  const email = str(formData, 'email').toLowerCase();
  const name = str(formData, 'name');
  const role = str(formData, 'role') || 'admin';
  const password = String(formData.get('password') ?? '');

  if (!email || !name) return { ok: false, message: 'Le nom et l’e-mail sont obligatoires.' };

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing && existing.id !== id) return { ok: false, message: 'Cet e-mail est déjà utilisé.' };

  if (!id) {
    if (password.length < 6) return { ok: false, message: 'Le mot de passe doit faire au moins 6 caractères.' };
    await prisma.adminUser.create({ data: { email, name, role, passwordHash: await hashPassword(password) } });
  } else {
    const data: { email: string; name: string; role: string; passwordHash?: string } = { email, name, role };
    if (password) {
      if (password.length < 6) return { ok: false, message: 'Le mot de passe doit faire au moins 6 caractères.' };
      data.passwordHash = await hashPassword(password);
    }
    await prisma.adminUser.update({ where: { id }, data });
  }

  redirect('/admin/utilisateurs');
}

export async function deleteAdminUser(formData: FormData) {
  const me = await requireAuth();
  const id = str(formData, 'id');
  if (!id || id === me.sub) return; // impossible de se supprimer soi-même
  const count = await prisma.adminUser.count();
  if (count <= 1) return; // garder au moins un compte
  await prisma.adminUser.delete({ where: { id } });
  revalidatePath('/admin/utilisateurs');
}
