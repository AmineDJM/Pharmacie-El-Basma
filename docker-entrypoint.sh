#!/bin/sh
# Démarrage du conteneur : migrations + seed idempotent + lancement du serveur.
set -e

echo "→ Application des migrations de base de données (prisma migrate deploy)…"
npx prisma migrate deploy

echo "→ Initialisation des données (seed idempotent)…"
node prisma/seed.mjs || echo "  seed ignoré (données déjà présentes ou non critique)"

echo "→ Démarrage de Next.js sur le port ${PORT:-3000}…"
exec npx next start -p "${PORT:-3000}"
