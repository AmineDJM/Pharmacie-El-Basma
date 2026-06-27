// Parapharmacie El Basma — Seed idempotent (exécuté au déploiement).
// Crée le compte admin, les paramètres, le catalogue et le contenu éditorial.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { articles } from './seed-articles.mjs';
import { faqs, reviews } from './seed-community.mjs';
import { categoryTranslations, productTranslations, articleTranslations } from './seed-translations.mjs';

const prisma = new PrismaClient();

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// ---------------------------------------------------------------------------
// Catégories (parents + sous-catégories) — pensées pour un méga-menu riche.
// ---------------------------------------------------------------------------
const categories = [
  {
    name: 'Soin du visage', icon: 'Sparkles', accent: 'emerald', featured: true,
    description: 'Nettoyants, hydratants, sérums et soins anti-âge pour une peau éclatante et protégée.',
    children: ['Nettoyants & démaquillants', 'Crèmes hydratantes', 'Sérums & concentrés', 'Anti-âge', 'Contour des yeux', 'Masques & gommages'],
  },
  {
    name: 'Soin du corps', icon: 'Hand', accent: 'teal', featured: true,
    description: 'Hydratation, gommages et soins ciblés pour nourrir et protéger votre peau au quotidien.',
    children: ['Laits & crèmes corps', 'Gommages & exfoliants', 'Mains & pieds', 'Vergetures & fermeté'],
  },
  {
    name: 'Cheveux & cuir chevelu', icon: 'Wind', accent: 'violet', featured: true,
    description: 'Shampoings, masques et traitements anti-chute pour des cheveux forts et sains.',
    children: ['Shampoings', 'Masques & après-shampoings', 'Anti-chute', 'Antipelliculaire', 'Colorations'],
  },
  {
    name: 'Bébé & maman', icon: 'Baby', accent: 'sky', featured: true,
    description: 'Tout pour le change, la toilette et le bien-être de bébé, et l’accompagnement de la maman.',
    children: ['Change & érythème', 'Toilette & bain', 'Soin & hydratation bébé', 'Maman & grossesse'],
  },
  {
    name: 'Compléments alimentaires', icon: 'Pill', accent: 'amber', featured: true,
    description: 'Vitamines, minéraux et compléments pour soutenir votre vitalité et votre équilibre.',
    children: ['Vitamines & minéraux', 'Immunité & vitalité', 'Sommeil & stress', 'Articulations & os', 'Minceur & détox'],
  },
  {
    name: 'Protection solaire', icon: 'Sun', accent: 'amber', featured: true,
    description: 'Hautes protections visage et corps adaptées au climat algérien, et soins après-soleil.',
    children: ['Solaire visage', 'Solaire corps', 'Après-soleil', 'Solaire bébé & enfant'],
  },
  {
    name: 'Hygiène & quotidien', icon: 'Droplets', accent: 'teal', featured: true,
    description: 'Hygiène corporelle, bucco-dentaire et déodorants pour une fraîcheur durable.',
    children: ['Hygiène bucco-dentaire', 'Hygiène corporelle', 'Déodorants', 'Hygiène intime'],
  },
  {
    name: 'Maquillage', icon: 'Palette', accent: 'rose', featured: true,
    description: 'Teint, lèvres et yeux dermatologiques qui prennent soin de votre peau.',
    children: ['Teint', 'Lèvres', 'Yeux', 'Ongles'],
  },
  {
    name: 'Homme', icon: 'User', accent: 'sky', featured: false,
    description: 'Rasage, soin du visage et soin capillaire spécialement formulés pour les hommes.',
    children: ['Rasage & barbe', 'Soin visage homme', 'Cheveux & corps homme'],
  },
  {
    name: 'Parapharmacie médicale', icon: 'Stethoscope', accent: 'emerald', featured: false,
    description: 'Premiers soins, orthopédie, contention et matériel pour la santé de toute la famille.',
    children: ['Premiers soins', 'Orthopédie & contention', 'Tension & diabète', 'Matériel médical'],
  },
  {
    name: 'Bien-être & aromathérapie', icon: 'Leaf', accent: 'violet', featured: false,
    description: 'Huiles essentielles, tisanes et solutions naturelles pour votre équilibre.',
    children: ['Huiles essentielles', 'Tisanes & infusions', 'Compléments naturels'],
  },
  {
    name: 'Minceur & nutrition', icon: 'Activity', accent: 'rose', featured: false,
    description: 'Accompagnement minceur, nutrition sportive et substituts pour atteindre vos objectifs.',
    children: ['Brûle-graisses & drainage', 'Substituts de repas', 'Nutrition sportive'],
  },
];

// ---------------------------------------------------------------------------
// Marques (sélection dermocosmétique de référence).
// ---------------------------------------------------------------------------
const brands = [
  { name: 'La Roche-Posay', accent: 'sky', featured: true, description: 'Soins dermatologiques pour peaux sensibles, recommandés par les dermatologues.' },
  { name: 'Avène', accent: 'teal', featured: true, description: 'L’expertise de l’Eau thermale d’Avène pour apaiser les peaux sensibles.' },
  { name: 'Bioderma', accent: 'sky', featured: true, description: 'La biologie au service de la dermatologie, du démaquillant aux soins ciblés.' },
  { name: 'Vichy', accent: 'sky', featured: true, description: 'Soins fortifiants à l’eau volcanique de Vichy, riche en minéraux.' },
  { name: 'CeraVe', accent: 'teal', featured: true, description: 'Soins aux céramides développés avec des dermatologues pour restaurer la barrière cutanée.' },
  { name: 'Mustela', accent: 'rose', featured: true, description: 'Soins doux et sûrs pour la peau délicate des bébés et des mamans.' },
  { name: 'Nuxe', accent: 'amber', featured: true, description: 'Cosmétiques naturels sensoriels, dont l’iconique Huile Prodigieuse.' },
  { name: 'Eucerin', accent: 'sky', featured: true, description: 'Soins dermatologiques innovants pour les peaux à problèmes.' },
  { name: 'Uriage', accent: 'teal', featured: false, description: 'L’Eau thermale d’Uriage pour hydrater et protéger toutes les peaux.' },
  { name: 'Ducray', accent: 'emerald', featured: false, description: 'Expert capillaire : anti-chute, antipelliculaire et cuir chevelu sensible.' },
  { name: 'Klorane', accent: 'amber', featured: false, description: 'Soins capillaires et corporels d’origine botanique.' },
  { name: 'SVR', accent: 'violet', featured: false, description: 'Dermocosmétique active à haute tolérance et concentrations efficaces.' },
  { name: 'Caudalie', accent: 'violet', featured: false, description: 'Soins anti-âge issus de la vigne et du raisin.' },
  { name: 'A-Derma', accent: 'emerald', featured: false, description: 'Soins à l’Avoine Rhealba pour les peaux fragiles et réactives.' },
  { name: 'Filorga', accent: 'rose', featured: false, description: 'Soins anti-âge experts inspirés de la médecine esthétique.' },
  { name: 'Forté Pharma', accent: 'amber', featured: false, description: 'Compléments alimentaires pour la vitalité, la minceur et le bien-être.' },
  { name: 'Arkopharma', accent: 'emerald', featured: false, description: 'Phytothérapie et compléments d’origine naturelle.' },
  { name: 'Weleda', accent: 'teal', featured: false, description: 'Cosmétiques naturels et biologiques pour toute la famille.' },
];

// ---------------------------------------------------------------------------
// Produits — names + brand + sous-catégorie + prix (DZD). Le reste est généré.
// ---------------------------------------------------------------------------
const P = (name, brand, category, price, oldPrice, short, badges = [], rc = 0) => ({
  name, brand, category, price, oldPrice, short, badges, rc,
});

const products = [
  // Soin du visage
  P('Eau Micellaire Sensibio H2O 500ml', 'Bioderma', 'nettoyants-demaquillants', 1850, 2200, 'Démaquillant micellaire iconique pour peaux sensibles, nettoie en douceur sans rincer.', ['featured', 'best'], 142),
  P('Gel Moussant Purifiant Effaclar 400ml', 'La Roche-Posay', 'nettoyants-demaquillants', 1990, null, 'Nettoyant moussant pour peaux grasses à imperfections, purifie sans dessécher.', ['best'], 98),
  P('Hydrabio Crème Hydratante 40ml', 'Bioderma', 'cremes-hydratantes', 2450, null, 'Soin hydratant longue durée pour peaux déshydratées, éclat immédiat.', ['featured'], 64),
  P('Tolériane Sensitive Crème 40ml', 'La Roche-Posay', 'cremes-hydratantes', 2290, 2690, 'Soin apaisant prébiotique pour peaux sensibles, renforce la barrière cutanée.', ['new'], 51),
  P('Sérum Vitamine C Pure 30ml', 'SVR', 'serums-concentres', 3200, 3800, 'Concentré antioxydant éclat qui unifie le teint et lisse la peau.', ['featured', 'best'], 73),
  P('Hyalu B5 Sérum Repulpant 30ml', 'La Roche-Posay', 'serums-concentres', 4100, null, 'Acide hyaluronique pur et vitamine B5 pour repulper et réparer.', ['new'], 39),
  P('Liftactiv Collagen Specialist 50ml', 'Vichy', 'anti-age', 4690, 5290, 'Soin anti-âge global qui corrige rides et fermeté pour un teint rajeuni.', ['featured'], 47),
  P('Time-Filler Crème Anti-Rides 50ml', 'Filorga', 'anti-age', 6200, null, 'Soin absolu multi-correction des rides inspiré de la médecine esthétique.', [], 28),
  P('Contour des Yeux Aquapower 15ml', 'Vichy', 'contour-des-yeux', 2890, null, 'Soin regard énergisant qui défatigue et hydrate le contour de l’œil.', [], 33),
  P('Masque Hydratant Hydrance 50ml', 'Avène', 'masques-gommages', 2390, 2790, 'Masque-crème désaltérant pour une peau repulpée et apaisée.', ['new'], 22),

  // Soin du corps
  P('Lait Hydratant Lipikar Lait 400ml', 'La Roche-Posay', 'laits-cremes-corps', 2150, null, 'Lait relipidant anti-dessèchement pour peaux sèches du corps et du visage.', ['featured', 'best'], 88),
  P('Cold Cream Corps Nourrissant 400ml', 'Avène', 'laits-cremes-corps', 2490, null, 'Soin nutrition intense pour peaux très sèches, confort immédiat.', [], 41),
  P('Gcommage Corps Énergisant 200ml', 'Nuxe', 'gommages-exfoliants', 2790, 3200, 'Gommage fondant aux grains de sucre pour une peau douce et lumineuse.', ['new'], 19),
  P('Crème Mains Réparatrice 50ml', 'Neutrogena', 'mains-pieds', 690, null, 'Soin concentré qui répare les mains très sèches dès la première application.', ['best'], 120),
  P('Huile Vergetures Bi-Oil 200ml', 'Bi-Oil', 'vergetures-fermete', 2350, 2790, 'Soin spécialisé pour atténuer l’apparence des vergetures et cicatrices.', ['featured'], 67),

  // Cheveux
  P('Shampoing Doux Fréquence 400ml', 'Klorane', 'shampoings', 1290, null, 'Shampoing à l’avoine pour une utilisation fréquente, tous types de cheveux.', ['best'], 76),
  P('Shampoing Anti-Chute Anaphase+ 200ml', 'Ducray', 'anti-chute', 2190, 2590, 'Shampoing complément des cures anti-chute, fortifie et donne du volume.', ['featured', 'best'], 94),
  P('Masque Nutritif Cheveux Secs 200ml', 'Klorane', 'masques-apres-shampoings', 1690, null, 'Masque réparateur à la mangue qui nourrit les cheveux secs et abîmés.', [], 31),
  P('Shampoing Antipelliculaire Squanorm 200ml', 'Ducray', 'antipelliculaire', 1890, null, 'Élimine les pellicules sèches et apaise le cuir chevelu qui démange.', ['new'], 44),
  P('Sérum Anti-Chute Triphasic 3x40ml', 'Vichy', 'anti-chute', 5290, 5990, 'Traitement intensif anti-chute qui cible les causes de la chute des cheveux.', ['featured'], 38),

  // Bébé & maman
  P('Liniment Oléo-Calcaire 500ml', 'Mustela', 'change-erytheme', 1290, null, 'Nettoie en douceur le siège de bébé et prévient l’érythème fessier.', ['best'], 110),
  P('Crème Change 1 2 3 100ml', 'Mustela', 'change-erytheme', 1490, 1790, 'Soin protecteur qui apaise et répare les rougeurs du siège.', ['featured'], 72),
  P('Gel Lavant Bébé Corps & Cheveux 500ml', 'Mustela', 'toilette-bain', 1690, null, 'Gel lavant doux sans savon pour le corps et les cheveux de bébé.', [], 58),
  P('Crème Hydratante Bébé Cold Cream 50ml', 'Mustela', 'soin-hydratation-bebe', 1390, null, 'Nourrit et protège la peau sèche et fragile de bébé.', ['new'], 27),
  P('Vergetures Crème Prévention Maman 150ml', 'Weleda', 'maman-grossesse', 2890, null, 'Huile-crème à l’amande douce pour préserver l’élasticité de la peau.', [], 18),

  // Compléments alimentaires
  P('Vitamine D3 Boîte 30 capsules', 'Forté Pharma', 'vitamines-mineraux', 1290, null, 'Soutient l’immunité, les os et le moral, idéale en période hivernale.', ['best'], 130),
  P('Magnésium Marin + B6 60 gélules', 'Arkopharma', 'sommeil-stress', 1690, 1990, 'Réduit la fatigue et le stress, favorise la détente et l’équilibre nerveux.', ['featured', 'best'], 102),
  P('Multivitamines Vitalité 30 comprimés', 'Forté Pharma', 'immunite-vitalite', 1890, null, 'Complexe complet de vitamines et minéraux pour un coup de boost quotidien.', ['featured'], 61),
  P('Oméga-3 1000mg 60 capsules', 'Arkopharma', 'immunite-vitalite', 2290, null, 'Acides gras essentiels pour le cœur, le cerveau et la vision.', [], 35),
  P('Collagène Articulations 30 sticks', 'Forté Pharma', 'articulations-os', 3490, 3990, 'Confort articulaire et souplesse grâce au collagène et à la vitamine C.', ['new'], 24),
  P('Fer + Vitamine B9 30 comprimés', 'Arkopharma', 'vitamines-mineraux', 1490, null, 'Lutte contre la fatigue liée au manque de fer, soutient la vitalité.', [], 29),
  P('Probiotiques Flore Intestinale 30 gélules', 'Arkopharma', 'immunite-vitalite', 2690, null, 'Rééquilibre la flore intestinale et soutient les défenses naturelles.', ['new'], 33),

  // Solaire
  P('Anthelios UVMune Fluide SPF50+ 50ml', 'La Roche-Posay', 'solaire-visage', 2890, null, 'Très haute protection visage invisible, idéale pour le climat algérien.', ['featured', 'best'], 121),
  P('Lait Solaire SPF50+ Corps 200ml', 'Avène', 'solaire-corps', 2690, 2990, 'Protection très élevée résistante à l’eau pour toute la famille.', ['best'], 84),
  P('Spray Solaire Enfant SPF50+ 200ml', 'Bioderma', 'solaire-bebe-enfant', 2790, null, 'Photoprotection enfant facile à appliquer, haute tolérance.', ['new'], 26),
  P('Après-Soleil Hydratant 400ml', 'Nuxe', 'apres-soleil', 1990, null, 'Prolonge le bronzage et apaise la peau après l’exposition.', [], 22),

  // Hygiène
  P('Dentifrice Quotidien Protection 75ml', 'Elgydium', 'hygiene-bucco-dentaire', 590, null, 'Protège efficacement contre la plaque dentaire et les caries.', ['best'], 90),
  P('Bain de Bouche Sans Alcool 500ml', 'Eludril', 'hygiene-bucco-dentaire', 1190, 1450, 'Apaise et assainit la bouche, haleine fraîche durable.', [], 37),
  P('Gel Douche Surgras Dermatologique 500ml', 'Eucerin', 'hygiene-corporelle', 1490, null, 'Nettoie en respectant le film hydrolipidique des peaux sensibles.', ['new'], 41),
  P('Déodorant Soin 48h Roll-on 50ml', 'Vichy', 'deodorants', 1290, null, 'Efficacité longue durée, respecte les peaux sensibles et épilées.', ['best'], 73),

  // Maquillage
  P('Fond de Teint Correcteur Dermablend 30ml', 'Vichy', 'teint', 3290, null, 'Couvrance haute longue tenue 16h, peau sublimée et protégée SPF.', ['featured'], 48),
  P('Stick Lèvres Cicaplast Baume 7.5ml', 'La Roche-Posay', 'levres', 690, null, 'Répare et nourrit les lèvres et les zones sèches, multi-usage.', ['best'], 115),
  P('Mascara Sensitif Yeux Sensibles', 'Avène', 'yeux', 1890, 2190, 'Mascara haute tolérance pour porteuses de lentilles et yeux sensibles.', ['new'], 21),

  // Homme
  P('Gel de Rasage Peaux Sensibles 150ml', 'Nickel', 'rasage-barbe', 1490, null, 'Rasage glissant et confortable qui prévient feu du rasoir et irritations.', [], 30),
  P('Soin Hydratant Visage Homme 50ml', 'Vichy Homme', 'soin-visage-homme', 2390, 2790, 'Hydrate, matifie et défatigue le visage des hommes au quotidien.', ['featured'], 36),

  // Parapharmacie médicale
  P('Thermomètre Frontal Sans Contact', 'Beurer', 'materiel-medical', 4490, 4990, 'Mesure rapide et hygiénique de la température, idéal pour toute la famille.', ['featured', 'best'], 57),
  P('Tensiomètre Bras Automatique', 'Omron', 'tension-diabete', 7990, null, 'Mesure fiable de la tension à domicile, mémorisation des résultats.', ['best'], 44),
  P('Bande de Contention Cheville', 'Thuasne', 'orthopedie-contention', 1690, null, 'Maintien et soutien de la cheville lors des entorses légères.', [], 16),
  P('Pansements Cicatrisants Assortis', 'Hansaplast', 'premiers-soins', 490, null, 'Protection et cicatrisation des petites plaies du quotidien.', ['best'], 88),

  // Bien-être & aromathérapie
  P('Huile Essentielle Lavande Vraie 10ml', 'Arkopharma', 'huiles-essentielles', 990, null, 'Apaisante et relaxante, favorise la détente et un sommeil serein.', ['best'], 64),
  P('Tisane Digestion & Détente 20 sachets', 'Arkopharma', 'tisanes-infusions', 690, null, 'Infusion de plantes pour faciliter la digestion et la relaxation.', [], 23),
  P('Gummies Sommeil Mélatonine 60u', 'Forté Pharma', 'sommeil-stress', 2190, 2490, 'Aide à réduire le temps d’endormissement pour des nuits réparatrices.', ['new', 'featured'], 49),

  // Minceur
  P('Brûleur de Graisses XtraSlim 120 gélules', 'Forté Pharma', 'brule-graisses-drainage', 3290, 3790, 'Programme minceur intensif qui cible les graisses et draine.', ['featured'], 52),
  P('Substitut de Repas Chocolat 10 sachets', 'Milical', 'substituts-de-repas', 2890, null, 'Repas hyperprotéiné équilibré pour accompagner la perte de poids.', [], 19),
];

// ---------------------------------------------------------------------------
// Helpers de génération
// ---------------------------------------------------------------------------
const longDescription = (p, brandName, catName) =>
  `${p.name}${brandName ? ` de ${brandName}` : ''} fait partie de notre sélection « ${catName} », rigoureusement choisie par les pharmaciens de la Parapharmacie El Basma à Boufarik.\n\n` +
  `${p.short} Sa formule allie efficacité, qualité et tolérance optimale pour répondre aux besoins de votre peau et de votre bien-être au quotidien.\n\n` +
  `Disponible en parapharmacie : demandez conseil à notre équipe pour une recommandation personnalisée, ou vérifiez sa disponibilité en un clic via WhatsApp avant de passer en boutique.`;

const defaultHighlights = (brandName) =>
  [
    'Sélectionné et validé par nos pharmaciens',
    'Qualité dermocosmétique & tolérance optimale',
    brandName ? `Marque de référence : ${brandName}` : 'Marque de référence en parapharmacie',
    'Disponibilité vérifiable en un clic sur WhatsApp',
  ].join('\n');

// Pseudo-aléatoire déterministe (reproductible entre deux seeds).
// Produits mis en avant dans la rubrique « Bio & Naturel ».
const BIO_SLUGS = new Set([
  'huile-essentielle-lavande-vraie-10ml',
  'tisane-digestion-detente-20-sachets',
  'vergetures-creme-prevention-maman-150ml',
  'shampoing-doux-frequence-400ml',
  'masque-nutritif-cheveux-secs-200ml',
  'probiotiques-flore-intestinale-30-gelules',
  'omega-3-1000mg-60-capsules',
  'magnesium-marin-b6-60-gelules',
]);

let seedN = 7;
const rand = () => {
  seedN = (seedN * 1103515245 + 12345) & 0x7fffffff;
  return seedN / 0x7fffffff;
};
const between = (min, max) => Math.round(min + rand() * (max - min));

async function main() {
  console.log('🌱 Seed Parapharmacie El Basma…');

  // --- Admin ---------------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@parapharmacie-elbasma.dz').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ElBasma2024!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: 'Administrateur', role: 'admin' },
    create: { email: adminEmail, name: 'Administrateur', role: 'admin', passwordHash },
  });
  console.log(`   ✓ Compte admin : ${adminEmail}`);

  // --- Paramètres ----------------------------------------------------------
  const openingHours = JSON.stringify([
    { day: 'Samedi', hours: '08:30 – 20:00' },
    { day: 'Dimanche', hours: '08:30 – 20:00' },
    { day: 'Lundi', hours: '08:30 – 20:00' },
    { day: 'Mardi', hours: '08:30 – 20:00' },
    { day: 'Mercredi', hours: '08:30 – 20:00' },
    { day: 'Jeudi', hours: '08:30 – 20:00' },
    { day: 'Vendredi', hours: '14:00 – 20:00' },
  ]);
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main', openingHours },
  });
  console.log('   ✓ Paramètres du site');

  // --- Catégories ----------------------------------------------------------
  const subSlugByName = {};
  let catOrder = 0;
  for (const cat of categories) {
    const slug = slugify(cat.name);
    const parent = await prisma.category.upsert({
      where: { slug },
      update: {
        name: cat.name, icon: cat.icon, accent: cat.accent, featured: cat.featured,
        description: cat.description, order: catOrder, translations: categoryTranslations[slug] || undefined,
      },
      create: {
        name: cat.name, slug, icon: cat.icon, accent: cat.accent, featured: cat.featured,
        description: cat.description, order: catOrder, translations: categoryTranslations[slug] || undefined,
      },
    });
    catOrder++;
    let childOrder = 0;
    for (const childName of cat.children) {
      const childSlug = slugify(childName);
      subSlugByName[childSlug] = childSlug;
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: { name: childName, accent: cat.accent, parentId: parent.id, order: childOrder, translations: categoryTranslations[childSlug] || undefined },
        create: { name: childName, slug: childSlug, accent: cat.accent, parentId: parent.id, order: childOrder, translations: categoryTranslations[childSlug] || undefined },
      });
      childOrder++;
    }
  }
  console.log(`   ✓ ${categories.length} catégories + sous-catégories`);

  // --- Marques -------------------------------------------------------------
  const brandIdBySlug = {};
  let brandOrder = 0;
  for (const b of brands) {
    const slug = slugify(b.name);
    const created = await prisma.brand.upsert({
      where: { slug },
      update: { name: b.name, accent: b.accent, featured: b.featured, description: b.description, order: brandOrder },
      create: { name: b.name, slug, accent: b.accent, featured: b.featured, description: b.description, order: brandOrder },
    });
    brandIdBySlug[slug] = created.id;
    brandOrder++;
  }
  console.log(`   ✓ ${brands.length} marques`);

  // --- Produits ------------------------------------------------------------
  const catBySlug = {};
  for (const c of await prisma.category.findMany()) catBySlug[c.slug] = c;

  let count = 0;
  for (const p of products) {
    const slug = slugify(p.name);
    const category = catBySlug[p.category];
    if (!category) {
      console.warn(`   ! catégorie introuvable pour ${p.name}: ${p.category}`);
      continue;
    }
    const brandSlug = p.brand ? slugify(p.brand) : null;
    const brandId = brandSlug ? brandIdBySlug[brandSlug] ?? null : null;
    const brandName = p.brand || null;
    const rating = (4.6 + rand() * 0.39).toFixed(1);
    const reviewCount = p.rc || between(8, 90);

    const data = {
      name: p.name,
      shortDescription: p.short,
      description: longDescription(p, brandName, category.name),
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      inStock: true,
      isFeatured: p.badges.includes('featured'),
      isNew: p.badges.includes('new'),
      isBestSeller: p.badges.includes('best'),
      isBio: BIO_SLUGS.has(slug) || p.badges.includes('bio'),
      rating: parseFloat(rating),
      reviewCount,
      highlights: defaultHighlights(brandName),
      categoryId: category.id,
      brandId,
      metaTitle: `${p.name} — Parapharmacie El Basma Boufarik`,
      metaDescription: `${p.short} Disponible à la Parapharmacie El Basma, Boufarik (Blida). Conseil pharmacien & disponibilité sur WhatsApp.`,
      translations: productTranslations[slug] || undefined,
    };

    await prisma.product.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    count++;
  }
  console.log(`   ✓ ${count} produits`);

  // --- Articles ------------------------------------------------------------
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: { ...a, translations: articleTranslations[a.slug] || undefined },
      create: { ...a, translations: articleTranslations[a.slug] || undefined },
    });
  }
  console.log(`   ✓ ${articles.length} articles (Conseils santé)`);

  // --- FAQ -----------------------------------------------------------------
  let faqOrder = 0;
  for (const f of faqs) {
    const id = `faq-${slugify(f.question).slice(0, 60)}`;
    await prisma.faq.upsert({
      where: { id },
      update: { question: f.question, answer: f.answer, category: f.category, order: faqOrder, published: true },
      create: { id, question: f.question, answer: f.answer, category: f.category, order: faqOrder, published: true },
    });
    faqOrder++;
  }
  console.log(`   ✓ ${faqs.length} questions fréquentes`);

  // --- Avis ----------------------------------------------------------------
  for (const r of reviews) {
    const id = `review-${slugify(r.author + '-' + r.content).slice(0, 60)}`;
    await prisma.review.upsert({
      where: { id },
      update: { ...r },
      create: { id, ...r },
    });
  }
  console.log(`   ✓ ${reviews.length} avis clients`);

  console.log('✅ Seed terminé.');
}

main()
  .catch((e) => {
    console.error('❌ Seed échoué :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
