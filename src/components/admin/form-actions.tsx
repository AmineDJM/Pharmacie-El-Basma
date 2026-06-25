'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Loader2, Save, Trash2 } from 'lucide-react';

export function SubmitButton({ label = 'Enregistrer' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </button>
  );
}

export function CancelLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
    >
      Annuler
    </Link>
  );
}

/** Delete button bound to a server action, with a confirmation prompt. */
export function DeleteButton({
  action,
  id,
  label = 'Supprimer',
  message = 'Confirmer la suppression ? Cette action est irréversible.',
  compact,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  message?: string;
  compact?: boolean;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(message)) e.preventDefault();
        }}
        aria-label={label}
        className={
          compact
            ? 'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30'
            : 'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-card px-5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30'
        }
      >
        <Trash2 className="h-4 w-4" />
        {!compact && label}
      </button>
    </form>
  );
}

/** Generic action button for inline forms (toggle read, etc.). */
export function InlineActionButton({
  action,
  fields,
  children,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <form action={action} className="inline">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        title={title}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {children}
      </button>
    </form>
  );
}
