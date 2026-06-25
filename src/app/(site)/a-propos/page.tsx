import Link from 'next/link';
import { Stethoscope, ShieldCheck, HeartHandshake, Sparkles, MapPin, Leaf, ArrowRight, Quote } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { buttonVariants } from '@/components/ui/button';
import { getSettings } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'À propos — Notre parapharmacie à Boufarik',
  description:
    'Découvrez la Parapharmacie El Basma à Boufarik (Blida) : notre histoire, nos valeurs et notre engagement à vous offrir des produits authentiques et des conseils de professionnels.',
  path: '/a-propos',
});

const VALUES = [
  { icon: Stethoscope, title: 'Expertise pharmaceutique', text: 'Une équipe formée qui vous oriente vers les solutions les plus adaptées à votre situation.' },
  { icon: ShieldCheck, title: 'Produits authentiques', text: 'Uniquement des marques de référence, sélectionnées pour leur qualité et leur tolérance.' },
  { icon: HeartHandshake, title: 'Écoute & bienveillance', text: 'Un accompagnement personnalisé, sans jugement, dans le respect de votre confidentialité.' },
  { icon: Sparkles, title: 'Sélection rigoureuse', text: 'Chaque produit de notre catalogue est choisi avec soin par nos pharmaciens.' },
  { icon: MapPin, title: 'Proximité', text: 'Au cœur de Boufarik, facilement accessible pour toute la région de Blida.' },
  { icon: Leaf, title: 'Bien-être global', text: 'De la dermocosmétique aux compléments, nous prenons soin de toute la famille.' },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'À propos', href: '/a-propos' }]}
        eyebrow="Qui sommes-nous"
        title="Votre parapharmacie de confiance à Boufarik"
        description="Depuis Boufarik, la Parapharmacie El Basma met l’expertise, la qualité et la proximité au service de votre santé et de votre beauté."
      />

      {/* Story */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col gap-5">
              <SectionHeading eyebrow="Notre histoire" title="Une parapharmacie pensée pour vous" align="left" />
              <div className="space-y-4 text-pretty leading-relaxed text-muted-foreground">
                <p>
                  La Parapharmacie El Basma est née d’une conviction simple : chacun mérite un accès facile à des
                  produits de santé et de beauté de qualité, accompagné de conseils fiables et bienveillants.
                </p>
                <p>
                  Idéalement située rue Menad Mohamed à Boufarik, notre parapharmacie réunit les plus grandes marques
                  de dermocosmétique, des compléments alimentaires, des soins pour bébé et toute une gamme de produits
                  d’hygiène et de bien-être.
                </p>
                <p>
                  Notre équipe vous reçoit avec attention pour comprendre vos besoins et vous orienter vers les
                  solutions les plus adaptées — en boutique, par téléphone ou sur WhatsApp.
                </p>
              </div>
              <div>
                <Link href="/contact" className={buttonVariants()}>
                  Venez nous rencontrer <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-primary-700 p-8 text-primary-foreground shadow-card">
                <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.25),transparent_55%)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <Quote className="h-12 w-12 opacity-30" />
                  <div>
                    <p className="font-display text-2xl font-bold leading-snug">
                      « Prendre soin de vous, simplement et avec expertise. »
                    </p>
                    <p className="mt-4 text-sm text-primary-foreground/80">
                      L’équipe de la Parapharmacie El Basma, Boufarik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-secondary/40 pt-16">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Nos engagements"
              title="Ce qui nous tient à cœur"
              description="Des valeurs concrètes qui guident chacun de nos conseils et chacune de nos sélections."
              align="center"
              className="mb-12 items-center"
            />
          </Reveal>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-100">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-700 px-6 py-12 text-center text-primary-foreground sm:px-12">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Une question ? Un conseil ?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Notre équipe est à votre disposition à Boufarik pour vous accompagner dans vos choix santé et beauté.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className={buttonVariants({ variant: 'white', size: 'lg' })}>
                Nous contacter
              </Link>
              <Link href="/produits" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'border-white/30 bg-white/10 text-white hover:bg-white/20' })}>
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
