import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { buttonVariants } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { getFaqs } from '@/lib/data';
import { buildMetadata, faqSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Questions fréquentes (FAQ)',
  description:
    'Réponses aux questions fréquentes sur la Parapharmacie El Basma à Boufarik : disponibilité des produits, conseils, marques, réservation, horaires, accès et livraison.',
  path: '/faq',
});

export default async function FaqPage() {
  const faqs = await getFaqs();

  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'FAQ', href: '/faq' }]}
        eyebrow="Aide"
        title="Questions fréquentes"
        description="Tout ce que vous devez savoir sur nos produits, nos services et notre parapharmacie à Boufarik."
      />

      <section className="section">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-10">
            {Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <h2 className="mb-4 font-display text-xl font-bold text-foreground">{category}</h2>
                <FaqAccordion items={items} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-border bg-secondary/40 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-100">
              <MessageCircleQuestion className="h-7 w-7" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Vous n’avez pas trouvé votre réponse ?</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Notre équipe est à votre écoute pour répondre à toutes vos questions et vous conseiller.
            </p>
            <Link href="/contact" className={buttonVariants()}>
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
    </>
  );
}
