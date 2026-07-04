'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';

export interface FormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  orderNumber?: string;
}

const emailSchema = z.string().email("L'adresse e-mail n'est pas valide.");

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') || '').toLowerCase().trim();
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, message: 'Veuillez saisir une adresse e-mail valide.' };
  }
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });
    return { ok: true, message: 'Merci ! Votre inscription à la newsletter est confirmée.' };
  } catch {
    return { ok: false, message: 'Une erreur est survenue. Merci de réessayer.' };
  }
}

const contactSchema = z.object({
  name: z.string().min(2, 'Indiquez votre nom.').max(120),
  email: z.string().email('Adresse e-mail invalide.'),
  phone: z.string().max(40).optional().or(z.literal('')),
  subject: z.string().min(2, 'Précisez l’objet.').max(160),
  message: z.string().min(10, 'Votre message est trop court.').max(4000),
});

export async function submitContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    subject: String(formData.get('subject') || '').trim(),
    message: String(formData.get('message') || '').trim(),
  };
  // Honeypot anti-spam (hidden field must stay empty).
  if (String(formData.get('company') || '')) {
    return { ok: true, message: 'Merci, votre message a bien été envoyé.' };
  }
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
    return { ok: false, message: 'Merci de corriger les champs indiqués.', errors };
  }
  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    return {
      ok: true,
      message: 'Merci, votre message a bien été envoyé. Notre équipe vous répondra rapidement.',
    };
  } catch {
    return { ok: false, message: 'L’envoi a échoué. Réessayez ou contactez-nous par téléphone.' };
  }
}

// ---------------------------------------------------------------------------
// Commandes (checkout)
// ---------------------------------------------------------------------------

const checkoutSchema = z.object({
  name: z.string().min(2, 'Indiquez votre nom complet.').max(120),
  phone: z
    .string()
    .min(6, 'Indiquez un numéro de téléphone valide.')
    .max(40)
    .regex(/[0-9]/, 'Indiquez un numéro de téléphone valide.'),
  email: z.string().email('Adresse e-mail invalide.').optional().or(z.literal('')),
  wilaya: z.string().min(2, 'Indiquez votre wilaya.').max(60),
  city: z.string().min(2, 'Indiquez votre commune / ville.').max(80),
  address: z.string().min(5, 'Indiquez une adresse de livraison complète.').max(400),
  notes: z.string().max(600).optional().or(z.literal('')),
});

const cartItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().positive().max(99),
  name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  slug: z.string().max(200).optional().nullable(),
  imageUrl: z.string().max(2048).optional().nullable(),
});

/** Generate a readable, unique order number (CMD-YYYYMMDD-NNNN). */
async function nextOrderNumber(): Promise<string> {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  let seq = (await prisma.order.count()) + 1;
  // Guard against collisions (extremely unlikely, but keep it airtight).
  for (let i = 0; i < 50; i++) {
    const candidate = `CMD-${ymd}-${String(seq).padStart(4, '0')}`;
    const clash = await prisma.order.findUnique({ where: { orderNumber: candidate }, select: { id: true } });
    if (!clash) return candidate;
    seq += 1;
  }
  return `CMD-${ymd}-${Date.now().toString().slice(-6)}`;
}

export async function placeOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot anti-spam.
  if (String(formData.get('company') || '')) {
    return { ok: true, message: 'Commande reçue.', orderNumber: 'CMD-000000' };
  }

  const customer = {
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    wilaya: String(formData.get('wilaya') || '').trim(),
    city: String(formData.get('city') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
  };

  const parsed = checkoutSchema.safeParse(customer);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
    return { ok: false, message: 'Merci de corriger les champs indiqués.', errors };
  }

  // Parse + validate the submitted cart.
  let rawItems: unknown;
  try {
    rawItems = JSON.parse(String(formData.get('items') || '[]'));
  } catch {
    rawItems = [];
  }
  const itemsParse = z.array(cartItemSchema).min(1).safeParse(rawItems);
  if (!itemsParse.success) {
    return { ok: false, message: 'Votre panier est vide. Ajoutez au moins un produit avant de commander.' };
  }
  const submitted = itemsParse.data;

  try {
    // Re-price from the database so the stored order is authoritative and can't
    // be tampered with client-side. Fall back to the snapshot if a product was
    // removed since the customer added it.
    const products = await prisma.product.findMany({
      where: { id: { in: submitted.map((i) => i.id) } },
      select: { id: true, name: true, slug: true, price: true, imageUrl: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const lines = submitted.map((item) => {
      const p = byId.get(item.id);
      const price = p ? p.price : item.price;
      const quantity = Math.min(99, Math.max(1, item.quantity));
      return {
        productId: p?.id ?? null,
        name: p?.name ?? item.name,
        slug: p?.slug ?? item.slug ?? null,
        imageUrl: p?.imageUrl ?? item.imageUrl ?? null,
        price,
        quantity,
        lineTotal: price * quantity,
      };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const deliveryFee = 0; // Frais convenus avec le client lors de la confirmation.
    const total = subtotal + deliveryFee;
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const orderNumber = await nextOrderNumber();

    await prisma.order.create({
      data: {
        orderNumber,
        status: 'pending',
        customerName: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        wilaya: parsed.data.wilaya,
        city: parsed.data.city,
        address: parsed.data.address,
        notes: parsed.data.notes || null,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        items: { create: lines },
      },
    });

    return {
      ok: true,
      message: 'Votre commande a bien été enregistrée. Notre équipe vous contactera pour la confirmer.',
      orderNumber,
    };
  } catch {
    return {
      ok: false,
      message: 'L’enregistrement de la commande a échoué. Réessayez ou contactez-nous par téléphone/WhatsApp.',
    };
  }
}
