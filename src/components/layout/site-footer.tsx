import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, Clock, Facebook, Instagram, ShieldCheck, Truck, Leaf } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { getSettings } from '@/lib/data';
import { getI18n } from '@/i18n/locale';
import { FOOTER_NAV } from '@/lib/constants';
import { whatsappLink, telLink } from '@/lib/utils';

export async function SiteFooter() {
  const settings = await getSettings();
  const { t } = await getI18n();
  const year = 2026;
  const fullAddress = `${settings.addressLine}, ${settings.city}, ${settings.wilaya}`;
  const mapsUrl =
    settings.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.pharmacyName} ${fullAddress}`)}`;

  return (
    <footer className="border-t border-border bg-secondary/40">
      {/* Newsletter */}
      <div className="container py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-700 px-6 py-10 text-primary-foreground sm:px-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('footer.newsletterTitle')}</h2>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/85">{t('footer.newsletterText')}</p>
            </div>
            <NewsletterForm className="md:justify-self-end md:w-full md:max-w-md" />
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="container grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: t('footer.trust1Title'), text: t('footer.trust1Text') },
          { icon: Leaf, title: t('footer.trust2Title'), text: t('footer.trust2Text') },
          { icon: Truck, title: t('footer.trust3Title'), text: t('footer.trust3Text') },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="container grid grid-cols-2 gap-8 py-12 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{settings.description}</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-primary">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{fullAddress} ({settings.country})</span>
              </a>
            </li>
            <li>
              <a href={telLink(settings.phone)} className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={whatsappLink(settings.whatsapp)} className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> {settings.email}
              </a>
            </li>
          </ul>
          {(settings.facebookUrl || settings.instagramUrl) && (
            <div className="mt-5 flex gap-2">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:text-primary">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:text-primary">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {FOOTER_NAV.map((section) => (
          <div key={section.title} className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Hours */}
      <div className="container border-t border-border py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" /> {t('footer.hours')}
          </span>
          {settings.openingHours.map((oh) => (
            <span key={oh.day}>
              <span className="font-medium text-foreground/80">{oh.day}</span> {oh.hours}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {settings.pharmacyName}. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-primary">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-primary">Confidentialité</Link>
            <Link href="/faq" className="hover:text-primary">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
