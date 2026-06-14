# SupBook — Backend

API REST construite avec Strapi v5.

## Prérequis

- Node.js v18+
- npm

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine du dossier backend :
HOST=0.0.0.0
PORT=1337
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=

## Lancer le serveur

```bash
npm run develop
```

Accès admin : http://localhost:1337/admin

## Modèle de données

- **Book** : title, isbn, cover_url, year, reading_status, rating
- **Author** : name, bio
- **Library-collection** : name, description
- **Review** : content

## Relations

- Book → Author (Many-to-One)
- Book ↔ Library-collection (Many-to-Many)
- Book → Review (One-to-One)
- Book → User (Many-to-One)