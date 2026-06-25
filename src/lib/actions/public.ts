'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';

export interface FormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
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
