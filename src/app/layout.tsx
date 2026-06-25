import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/seo/json-ld';
import { SwRegister } from '@/components/pwa/sw-register';
import { getSettings } from '@/lib/data';
import { localBusinessSchema, websiteSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: Array.from(siteConfig.keywords),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon' }],
  },
  formatDetection: { telephone: true, address: true, email: true },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: siteConfig.shortName },
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  category: 'health',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0e8a6b' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1715' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
        <JsonLd data={[websiteSchema(), localBusinessSchema(settings)]} />
        <SwRegister />
      </body>
    </html>
  );
}
