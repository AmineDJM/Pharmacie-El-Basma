'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { submitContactMessage, type FormState } from '@/lib/actions/public';
import { cn } from '@/lib/utils';

const initial: FormState = { ok: false, message: '' };

const SUBJECTS = [
  'Demande d’information',
  'Demander une disponibilité',
  'Conseil produit',
  'Réservation de produit',
  'Réclamation',
  'Autre',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-600 hover:shadow-glow disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      Envoyer le message
    </button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initial);
  const params = useSearchParams();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sujet = params.get('sujet');
    const produit = params.get('produit');
    if (sujet === 'disponibilite') {
      setSubject('Demander une disponibilité');
      if (produit) setMessage(`Bonjour, je souhaite connaître la disponibilité du produit : ${produit}.`);
    }
  }, [params]);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary-50 p-8 text-center dark:bg-primary-100">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h3 className="font-display text-xl font-bold text-primary-900">Message envoyé !</h3>
        <p className="max-w-md text-sm text-primary-900/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet *" error={state.errors?.name}>
          <input name="name" required className={inputClass} placeholder="Votre nom" autoComplete="name" />
        </Field>
        <Field label="E-mail *" error={state.errors?.email}>
          <input name="email" type="email" required className={inputClass} placeholder="vous@exemple.com" autoComplete="email" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone" error={state.errors?.phone}>
          <input name="phone" className={inputClass} placeholder="0X XX XX XX XX" autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="Objet *" error={state.errors?.subject}>
          <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message *" error={state.errors?.message}>
        <textarea
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, 'h-auto resize-y py-3')}
          placeholder="Comment pouvons-nous vous aider ?"
        />
      </Field>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {!state.ok && state.message && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40">{state.message}</p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <SubmitButton />
        <p className="text-xs text-muted-foreground">Réponse sous 24h ouvrées · Données confidentielles</p>
      </div>
    </form>
  );
}
