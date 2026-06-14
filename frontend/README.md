# SupBook — Frontend

Interface utilisateur construite avec React 19 et Vite.

# Prérequis

- Node.js v18+
- npm
- Backend Strapi lancé sur le port 1337

# Installation

```bash
npm install
```

# Variables d'environnement

Créer un fichier `.env` à la racine du dossier frontend :
VITE_API_URL=http://localhost:1337

# Lancer l'application

```bash
npm run dev
```

Accès : http://localhost:5174

# Structure du projet
12:02

Parfait !  Le backend README est bon.

Maintenant ouvre frontend/README.md et colle ce contenu :
markdown

# SupBook — Frontend

Interface utilisateur construite avec React 19 et Vite.

# Prérequis

- Node.js v18+
- npm
- Backend Strapi lancé sur le port 1337

# Installation

```bash
npm install
```

# Variables d'environnement

Créer un fichier `.env` à la racine du dossier frontend :

VITE_API_URL=http://localhost:1337


# Lancer l'application

```bash
npm run dev
```

Accès : http://localhost:5174

# Structure du projet

src/
├── components/ # Composants réutilisables
├── pages/ # Pages de l'application
├── services/ # Appels API
└── hooks/ # Hooks personnalisés
# Pages

- `/login` — Connexion
- `/register` — Inscription
- `/library` — Bibliothèque personnelle
- `/collections` — Gestion des collections