'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { subscribeNewsletter, type FormState } from '@/lib/actions/public';
import { useT } from '@/i18n/provider';
import { cn } from '@/lib/utils';

const initial: FormState = { ok: false, message: '' };

function SubmitButton() {
  const t = useT();
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-600 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="hidden sm:inline">{t('footer.subscribe')}</span>
    </button>
  );
}

export function NewsletterForm({ className }: { className?: string }) {
  const t = useT();
  const [state, formAction] = useActionState(subscribeNewsletter, initial);

  if (state.ok) {
    return (
      <div className={cn('flex items-center gap-3 rounded-xl bg-primary-50 p-4 text-sm font-medium text-primary-700 dark:bg-primary-100 dark:text-primary-900', className)}>
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className={cn('flex flex-col gap-2', className)}>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Adresse e-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder={t('footer.emailPlaceholder')}
          className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <SubmitButton />
      </div>
      {!state.ok && state.message && <p className="text-xs text-red-600">{state.message}</p>}
    </form>
  );
}
