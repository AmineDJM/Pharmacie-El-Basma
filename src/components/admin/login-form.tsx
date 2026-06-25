'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, LogIn } from 'lucide-react';
import { loginAction } from '@/lib/actions/admin';
import { inputClass, Field, FormError } from '@/components/admin/ui';
import type { FormState } from '@/lib/actions/public';

const initial: FormState = { ok: false, message: '' };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      Se connecter
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initial);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Adresse e-mail" htmlFor="email" required>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="admin@parapharmacie-elbasma.dz" className={inputClass} />
      </Field>
      <Field label="Mot de passe" htmlFor="password" required>
        <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputClass} />
      </Field>
      <FormError message={state.message} />
      <Submit />
    </form>
  );
}
