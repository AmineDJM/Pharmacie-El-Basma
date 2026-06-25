import { MapPin, Phone, MessageCircle, Clock, Navigation } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import type { Settings } from '@/lib/data';
import { whatsappLink, telLink } from '@/lib/utils';

export function MapSection({ settings, showHeading = true }: { settings: Settings; showHeading?: boolean }) {
  const fullAddress = `${settings.addressLine}, ${settings.city}, ${settings.wilaya}, ${settings.country}`;
  const query = `${settings.latitude},${settings.longitude}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directionsUrl =
    settings.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  return (
    <div className="grid gap-6 overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-7 sm:p-9">
        {showHeading && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nous trouver</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Venez nous rencontrer à Boufarik
            </h2>
          </div>
        )}

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Adresse</p>
              <p className="text-sm text-muted-foreground">{fullAddress}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Horaires</p>
              <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                {settings.openingHours.map((oh) => (
                  <li key={oh.day} className="flex justify-between gap-6">
                    <span>{oh.day}</span>
                    <span className="font-medium text-foreground/80">{oh.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: 'md' })}
          >
            <Navigation className="h-4 w-4" /> Itinéraire
          </a>
          <a href={telLink(settings.phone)} className={buttonVariants({ variant: 'outline', size: 'md' })}>
            <Phone className="h-4 w-4" /> Appeler
          </a>
          <a
            href={whatsappLink(settings.whatsapp, 'Bonjour, je souhaite des informations.')}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline', size: 'md' })}
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="relative min-h-[320px] bg-muted lg:min-h-full">
        <iframe
          title={`Localisation de ${settings.pharmacyName} à ${settings.city}`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
