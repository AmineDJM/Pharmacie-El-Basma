// Seed data for community content: FAQ entries and customer reviews.
// Parapharmacie El Basma — Rue Menad Mohamed, Boufarik, Wilaya de Blida, Algérie.
// Plain ESM JavaScript (no TypeScript).

export const faqs = [
  {
    question: "Comment savoir si un produit est disponible en stock ?",
    answer:
      "Le plus simple est d’utiliser le bouton « Demander la disponibilité » présent sur chaque fiche produit : nous vous répondons rapidement. Vous pouvez également nous écrire sur WhatsApp, nous appeler ou passer directement à la parapharmacie à Boufarik. Notre équipe vérifie le stock en temps réel et vous oriente vers une alternative si besoin.",
    category: "Commande & disponibilité",
    order: 0,
    published: true,
  },
  {
    question: "À quoi sert le bouton « Demander la disponibilité » ?",
    answer:
      "Cette fonctionnalité vous permet de nous interroger sur un article précis sans vous déplacer. Vous nous transmettez le produit qui vous intéresse et nous confirmons sa disponibilité, son prix et, le cas échéant, le délai de réapprovisionnement. C’est rapide et sans engagement.",
    category: "Commande & disponibilité",
    order: 1,
    published: true,
  },
  {
    question: "Puis-je réserver un produit avant de venir le récupérer ?",
    answer:
      "Oui, nous pouvons mettre un produit de côté pour vous afin de vous garantir sa disponibilité. Il vous suffit de nous contacter par WhatsApp ou par téléphone, ou de nous le demander via la fiche produit. Nous gardons votre article en réserve pendant un délai raisonnable jusqu’à votre passage.",
    category: "Commande & disponibilité",
    order: 2,
    published: true,
  },
  {
    question: "Quels sont vos horaires d’ouverture ?",
    answer:
      "La parapharmacie est ouverte du samedi au jeudi, en journée continue ou en deux services selon la saison. Pour connaître les horaires exacts du jour, nous vous invitons à consulter notre page de contact ou à nous joindre directement. N’hésitez pas à nous écrire sur WhatsApp pour vous assurer de notre ouverture avant de vous déplacer.",
    category: "Horaires & accès",
    order: 3,
    published: true,
  },
  {
    question: "Où se situe la parapharmacie et comment y accéder ?",
    answer:
      "Nous sommes situés Rue Menad Mohamed, à Boufarik, dans la wilaya de Blida. L’accès est facile depuis le centre-ville de Boufarik et les communes voisines comme Beni Mered, Mouzaïa ou Oued El Alleug. Un point de repère ou une indication peuvent vous être communiqués sur simple demande via WhatsApp.",
    category: "Horaires & accès",
    order: 4,
    published: true,
  },
  {
    question: "Proposez-vous des conseils personnalisés sur la dermocosmétique ?",
    answer:
      "Absolument, nos pharmaciens vous accompagnent dans le choix des soins adaptés à votre type de peau, qu’elle soit sèche, grasse, mixte ou sensible. Nous prenons le temps d’analyser vos besoins pour vous orienter vers les routines et les textures les plus appropriées. Ce conseil est gratuit, que vous achetiez sur place ou que vous nous interrogiez à distance.",
    category: "Produits & conseils",
    order: 5,
    published: true,
  },
  {
    question: "Comment choisir un soin adapté à mon type de peau ?",
    answer:
      "Le bon produit dépend de votre type de peau, de vos éventuelles sensibilités et de l’objectif recherché (hydratation, anti-imperfections, anti-âge, protection solaire). Nos pharmaciens vous posent quelques questions simples afin d’affiner la recommandation et d’éviter les associations inutiles. N’hésitez pas à décrire votre peau lorsque vous nous contactez, nous vous guiderons pas à pas.",
    category: "Produits & conseils",
    order: 6,
    published: true,
  },
  {
    question: "Quelles marques de dermocosmétique proposez-vous ?",
    answer:
      "Nous référençons les grandes marques de dermocosmétique reconnues en pharmacie, comme La Roche-Posay, Avène, Bioderma, Vichy et CeraVe, ainsi que Mustela pour les soins bébé. La disponibilité de chaque référence peut évoluer selon les arrivages. Pour un produit précis, utilisez « Demander la disponibilité » et nous vous confirmons sa présence en stock.",
    category: "Produits & conseils",
    order: 7,
    published: true,
  },
  {
    question: "Avez-vous des produits de soin pour bébé ?",
    answer:
      "Oui, nous proposons une gamme complète de soins bébé : hygiène, change, hydratation, nettoyants doux et accessoires du quotidien. Nous travaillons notamment avec des marques spécialisées comme Mustela, reconnues pour leur tolérance sur les peaux fragiles. Nos pharmaciens vous conseillent volontiers sur les produits les plus adaptés à votre enfant.",
    category: "Produits & conseils",
    order: 8,
    published: true,
  },
  {
    question: "Vendez-vous des compléments alimentaires ?",
    answer:
      "Oui, nous disposons d’un large choix de compléments alimentaires : vitamines, minéraux, soutien de l’immunité, fatigue, beauté de la peau et des cheveux, entre autres. Nos pharmaciens vous orientent vers la formule la plus pertinente selon votre besoin et vous rappellent les bonnes conditions d’utilisation. Pour tout traitement en cours, un avis professionnel reste recommandé.",
    category: "Produits & conseils",
    order: 9,
    published: true,
  },
  {
    question: "Vendez-vous des produits solaires et d’hygiène ?",
    answer:
      "Tout à fait, nous proposons une sélection de protections solaires pour le visage et le corps, adaptées aux différents types de peau et aux peaux sensibles. Nous référençons également de nombreux produits d’hygiène et de cosmétique pour toute la famille. N’hésitez pas à nous demander conseil pour choisir l’indice de protection le mieux adapté.",
    category: "Produits & conseils",
    order: 10,
    published: true,
  },
  {
    question: "Êtes-vous une pharmacie ? Délivrez-vous des médicaments sur ordonnance ?",
    answer:
      "Nous sommes une parapharmacie : nous proposons des produits parapharmaceutiques tels que la dermocosmétique, les compléments alimentaires, les soins bébé, l’hygiène et les produits solaires. Nous ne délivrons pas de médicaments sur ordonnance, qui relèvent exclusivement des pharmacies d’officine. Pour tout besoin de ce type, nous vous invitons à vous rapprocher d’une pharmacie.",
    category: "Général",
    order: 11,
    published: true,
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Le règlement s’effectue sur place, directement à la parapharmacie, lors du retrait de vos produits. Cela vous permet de vérifier vos articles et de bénéficier des conseils de notre équipe au moment de l’achat. Pour toute question sur une commande ou une réservation, contactez-nous au préalable via WhatsApp ou par téléphone.",
    category: "Commande & disponibilité",
    order: 12,
    published: true,
  },
  {
    question: "Proposez-vous la livraison de mes produits ?",
    answer:
      "Notre fonctionnement privilégie la réservation puis le retrait sur place, où vous réglez votre commande et profitez des conseils de nos pharmaciens. Selon les périodes, des solutions de remise peuvent être étudiées au cas par cas autour de Boufarik et de Blida. Le plus simple est de nous contacter sur WhatsApp pour convenir ensemble des modalités.",
    category: "Livraison",
    order: 13,
    published: true,
  },
];

export const reviews = [
  {
    author: "Yasmine B.",
    rating: 5,
    content:
      "Un accueil chaleureux et des conseils vraiment professionnels. La pharmacienne a pris le temps de m’expliquer la routine adaptée à ma peau sensible, je recommande vivement.",
    source: "Google",
    location: "Boufarik",
    approved: true,
    featured: true,
  },
  {
    author: "Karim T.",
    rating: 5,
    content:
      "Très bon choix de produits dermocosmétiques, on trouve toutes les grandes marques. Les prix sont corrects et le personnel est de bon conseil.",
    source: "Google",
    location: "Blida",
    approved: true,
    featured: true,
  },
  {
    author: "Nadia M.",
    rating: 5,
    content:
      "Parapharmacie propre, bien organisée et très agréable. J’ai trouvé tous les soins bébé dont j’avais besoin et on m’a parfaitement orientée.",
    source: "Facebook",
    location: "Beni Mered",
    approved: true,
    featured: true,
  },
  {
    author: "Sofiane K.",
    rating: 5,
    content:
      "Service impeccable et équipe à l’écoute. J’ai demandé la disponibilité d’un produit sur leur site et j’ai eu une réponse très rapide, c’est pratique.",
    source: "Sur place",
    location: "Boufarik",
    approved: true,
    featured: true,
  },
  {
    author: "Imène D.",
    rating: 5,
    content:
      "Excellents conseils pour mes compléments alimentaires. On sent un vrai professionnalisme et de la patience pour bien répondre aux questions.",
    source: "Google",
    location: "Mouzaïa",
    approved: true,
    featured: false,
  },
  {
    author: "Rachid A.",
    rating: 4,
    content:
      "Bon accueil et large gamme de produits. Il y avait un peu de monde lors de mon passage, mais l’équipe reste efficace et souriante.",
    source: "Google",
    location: "Boufarik",
    approved: true,
    featured: false,
  },
  {
    author: "Lynda H.",
    rating: 5,
    content:
      "J’apprécie beaucoup la qualité des conseils sur les soins du visage. On ne me pousse jamais à acheter, on me recommande ce qui me convient vraiment.",
    source: "Facebook",
    location: "Blida",
    approved: true,
    featured: false,
  },
  {
    author: "Mohamed S.",
    rating: 5,
    content:
      "Très bonne adresse à Boufarik, facile d’accès. Produits authentiques, magasin bien tenu et personnel vraiment compétent.",
    source: "Sur place",
    location: "Oued El Alleug",
    approved: true,
    featured: false,
  },
  {
    author: "Sarah L.",
    rating: 4,
    content:
      "Belle sélection de protections solaires et de cosmétiques. Les conseils sont sérieux et le rapport qualité-prix est intéressant.",
    source: "Google",
    location: "Beni Mered",
    approved: true,
    featured: false,
  },
  {
    author: "Walid R.",
    rating: 5,
    content:
      "Équipe accueillante et de très bon conseil pour les produits de ma fille. J’ai pu réserver un article et le récupérer sans aucun souci, merci à eux.",
    source: "Facebook",
    location: "Boufarik",
    approved: true,
    featured: false,
  },
];
