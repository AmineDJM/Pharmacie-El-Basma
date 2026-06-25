# 🌿 Parapharmacie El Basma — Site web officiel

Site web professionnel, moderne et ultra-rapide pour la **Parapharmacie El Basma**, située rue Menad Mohamed à **Boufarik (Wilaya de Blida, Algérie)**.

Conçu comme une vitrine premium **et** une plateforme entièrement gérable par le pharmacien, sans aucune compétence technique, grâce à un **espace d'administration complet**.

> Dermocosmétique · Compléments alimentaires · Soins bébé · Hygiène · Solaire · Conseils de pharmaciens.

---

## ✨ Fonctionnalités

### Côté visiteurs
- **Accueil premium** : hero animé, catégories illustrées, produits mis en avant, promotions, marques, avis clients, conseils santé, FAQ et carte.
- **Catalogue complet** : recherche intelligente avec autocomplétion, filtres dynamiques (catégorie, marque, promo), tri, pagination — pensé pour des **milliers de produits**.
- **Fiches produits** riches avec produits similaires, points forts et bouton **« Demander la disponibilité »** (WhatsApp en un clic).
- **Favoris**, **comparateur de produits** et **produits récemment consultés** (stockés localement, sans compte).
- **Pages catégories & marques** optimisées pour le SEO local.
- **Blog Conseils santé** optimisé SEO, **FAQ interactive**, **fil d'Ariane**.
- **Contact** : formulaire validé, carte Google Maps, itinéraire, horaires, appel direct, WhatsApp.
- **Bouton WhatsApp flottant**, **newsletter**, **mode clair/sombre**, **PWA installable** avec **mode hors-ligne**.
- **Accessibilité WCAG AA**, animations fluides (Framer Motion), 100 % responsive.

### Côté administration (`/admin`)
Tout est géré depuis une interface simple et claire :
- **Produits**, **catégories**, **marques**, **articles** (conseils santé), **avis clients**, **FAQ** : création / modification / suppression.
- **Messages de contact** : lecture, réponse (e-mail / téléphone / WhatsApp), archivage.
- **Newsletter** : liste des abonnés, copie et export CSV.
- **Paramètres du site** : coordonnées, horaires, réseaux sociaux, bandeau d'annonce, géolocalisation — **modifiables sans toucher au code**.

---

## 🧱 Stack technique

| Domaine | Technologie |
|---|---|
| Framework | **Next.js 15** (App Router) + **React 19** |
| Langage | **TypeScript** |
| Styles | **Tailwind CSS** + design system maison (vert/blanc) |
| Animations | **Framer Motion** |
| Base de données | **PostgreSQL** + **Prisma ORM** |
| Authentification | Sessions signées (JWT `jose`) + `bcrypt` |
| SEO | Metadata API, JSON-LD (LocalBusiness/Pharmacy, Product, Article, FAQ, Breadcrumb), `sitemap.xml`, `robots.txt`, OpenGraph, Twitter Cards |
| PWA | Manifest + Service Worker (cache & hors-ligne) |
| Déploiement | **Docker** · **Render.com** (Blueprint) |

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js ≥ 20 et npm
- Soit **Docker** (recommandé), soit une base **PostgreSQL** locale

### Option A — Avec Docker (le plus simple)

```bash
git clone <votre-repo> parapharmacie-el-basma
cd parapharmacie-el-basma
docker compose up --build
```

➡️ Le site est disponible sur **http://localhost:3000** et l'admin sur **http://localhost:3000/admin**.
La base est créée, migrée et alimentée (seed) automatiquement.

### Option B — En local (Node + PostgreSQL)

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env
#   → renseignez DATABASE_URL (PostgreSQL) et SESSION_SECRET

# 3. Base de données : migrations + données de démonstration
npm run db:deploy   # applique les migrations
npm run db:seed     # crée l'admin, le catalogue, les articles, etc.

# 4. Lancement
npm run dev         # http://localhost:3000
```

> Besoin d'une base PostgreSQL rapidement ? `docker compose up db -d` démarre uniquement la base sur `localhost:5432`.

---

## 🔑 Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://elbasma:elbasma@localhost:5432/elbasma?schema=public` |
| `SESSION_SECRET` | Clé secrète des sessions admin (longue & aléatoire) | `openssl rand -base64 48` |
| `ADMIN_EMAIL` | E-mail du compte admin (créé au seed) | `admin@parapharmacie-elbasma.dz` |
| `ADMIN_PASSWORD` | Mot de passe admin initial | `ElBasma2024!` |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, sitemap, OG) | `https://parapharmacie-elbasma.dz` |
| `NEXT_PUBLIC_PHONE` | Téléphone affiché (modifiable aussi dans l'admin) | `+213 25 00 00 00` |
| `NEXT_PUBLIC_WHATSAPP` | Numéro WhatsApp (chiffres uniquement) | `213660000000` |

---

## 🛠️ Espace d'administration

- **URL** : `/admin`
- **Identifiants par défaut** : ceux de `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> ⚠️ **Important** : après le premier déploiement, renseignez les **vraies coordonnées** (téléphone, WhatsApp, adresse, horaires, réseaux sociaux) dans **Admin → Paramètres**, et changez le mot de passe administrateur.

---

## ☁️ Déploiement sur Render.com

### Méthode 1 — Blueprint (recommandée, en un clic)
1. Poussez ce dépôt sur GitHub.
2. Sur Render : **New + → Blueprint**, sélectionnez le dépôt. Render lit `render.yaml`.
3. Render crée automatiquement :
   - une base **PostgreSQL** managée,
   - un service **web Docker** relié à la base (`DATABASE_URL` injecté).
4. Renseignez la variable **`ADMIN_PASSWORD`** (marquée `sync: false`) dans le dashboard.
5. Déployez. Au démarrage, le conteneur applique les **migrations** puis le **seed** automatiquement.

### Méthode 2 — Manuelle
1. Créez un **PostgreSQL** sur Render et copiez l'`Internal Database URL`.
2. Créez un **Web Service** de type **Docker** pointant sur ce dépôt.
3. Ajoutez les variables d'environnement du tableau ci-dessus.
4. Déployez.

> Le `Dockerfile` construit l'application, et `docker-entrypoint.sh` exécute `prisma migrate deploy` + le seed avant de lancer Next.js.

---

## 📈 SEO & performance

- **Lighthouse > 95** visé sur Performance, SEO, Accessibilité et Best Practices.
- Métadonnées optimisées pour : _pharmacie Boufarik_, _parapharmacie Boufarik_, _pharmacie Blida_, _compléments alimentaires Boufarik_, _dermocosmétique Boufarik_, _cosmétique / bébé Boufarik_…
- **Données structurées** Schema.org (LocalBusiness + Pharmacy, Product, BlogPosting, FAQPage, BreadcrumbList) pour Google & Google Business Profile.
- `sitemap.xml` **dynamique**, `robots.txt`, canonicals, OpenGraph + Twitter Cards, image OG générée.
- Images optimisées (AVIF/WebP via `next/image`), polices auto-hébergées, lazy-loading, cache intelligent.

---

## 🗂️ Structure du projet

```
src/
├── app/
│   ├── (site)/            # Pages publiques (accueil, produits, blog, contact…)
│   ├── admin/             # Espace d'administration (login + panel protégé)
│   ├── api/               # Routes API (recherche, export)
│   ├── sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx
│   └── layout.tsx · globals.css
├── components/
│   ├── layout/  ui/  home/  product/  cards/  forms/  admin/  search/ …
├── lib/
│   ├── data.ts            # Accès aux données (cache + sûr au build)
│   ├── actions/           # Server Actions (public + admin)
│   ├── auth.ts · session.ts · seo.ts · visuals.ts · utils.ts · constants.ts
prisma/
├── schema.prisma · seed.mjs · migrations/
```

---

## 📜 Scripts npm

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Génère le client Prisma + build de production |
| `npm run start` | Serveur de production |
| `npm run db:deploy` | Applique les migrations |
| `npm run db:seed` | Alimente la base (idempotent) |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run lint` / `typecheck` | Qualité du code |

---

## 🔭 Architecture évolutive

Le projet est pensé pour accueillir facilement, plus tard :
- 🛒 **E-commerce** & paiement en ligne, panier, gestion des stocks
- 📅 **Prise de rendez-vous** & réservation de produits
- 👤 **Espace client** & notifications
- 🤖 **Chatbot IA** de conseil
- 🌍 **Version arabe** (architecture i18n-ready)

Le schéma de données, la couche d'accès et les composants sont modulaires pour intégrer ces fonctionnalités sans refonte.

---

## 📄 Licence

Projet propriétaire réalisé pour la Parapharmacie El Basma — Boufarik, Blida, Algérie.
