import { Suspense } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ContactForm } from '@/components/forms/contact-form';
import { MapSection } from '@/components/home/map-section';
import { getSettings } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { whatsappLink, telLink } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Contact & accès',
  description:
    'Contactez la Parapharmacie El Basma à Boufarik (Blida) : téléphone, WhatsApp, e-mail, adresse, horaires et itinéraire. Demandez la disponibilité d’un produit ou un conseil.',
  path: '/contact',
});

export default async function ContactPage() {
  const settings = await getSettings();

  const methods = [
    { icon: Phone, label: 'Téléphone', value: settings.phone, href: telLink(settings.phone) },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Discuter maintenant', href: whatsappLink(settings.whatsapp, 'Bonjour, je vous contacte depuis votre site.') },
    { icon: Mail, label: 'E-mail', value: settings.email, href: `mailto:${settings.email}` },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
        eyebrow="Contact"
        title="Parlons de vos besoins"
        description="Une question, une disponibilité à vérifier, un conseil ? Notre équipe vous répond rapidement."
      />

      <section className="section">
        <div className="container">
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
                  <m.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className="font-semibold text-foreground transition-colors group-hover:text-primary">{m.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Écrivez-nous</h2>
              <p className="mb-6 mt-1.5 text-sm text-muted-foreground">
                Remplissez le formulaire, nous revenons vers vous sous 24h ouvrées.
              </p>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
                <ContactForm />
              </Suspense>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.addressLine}, {settings.city}, {settings.wilaya} ({settings.country})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="w-full">
                  <p className="font-semibold text-foreground">Horaires</p>
                  <ul className="mt-1.5 space-y-0.5 text-sm text-muted-foreground">
                    {settings.openingHours.map((oh) => (
                      <li key={oh.day} className="flex justify-between">
                        <span>{oh.day}</span>
                        <span className="font-medium text-foreground/80">{oh.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <MapSection settings={settings} showHeading={false} />
          </div>
        </div>
      </section>
    </>
  );
}
