import type { Metadata } from 'next';
import { LogoMark } from '@/components/ui/logo';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Connexion — Administration',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-background dark:from-primary-50/10" />
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Espace administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Parapharmacie El Basma</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Accès réservé à l’équipe de la parapharmacie.
        </p>
      </div>
    </div>
  );
}
