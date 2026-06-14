# SupBook

Application de gestion de bibliothèque personnelle permettant de gérer, organiser et suivre sa collection de livres numériques ou physiques.

# Technologies

- **Backend** : Strapi v5, SQLite
- **Frontend** : React 19, Vite, React Router DOM

# Installation

# 1. Cloner le projet

```bash
git clone https://github.com/fati3001/supbook.git
cd supbook
```

# 2. Lancer le backend

```bash
cd backend
npm install
npm run develop
```

# 3. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

# Accès

- Frontend : http://localhost:5174
- Admin Strapi : http://localhost:1337/admin

# Fonctionnalités

- Inscription et connexion avec token JWT
- Ajout, modification et suppression de livres
- Gestion des auteurs
- Statut de lecture (à lire, en cours, terminé)
- Notation et avis personnels
- Collections de livres
- Recherche par titre et filtrage par statut
- Interface responsive mobile

# Choix techniques

- **Strapi v5** pour la rapidité de mise en place d'une API REST robuste
- **React + Vite** pour une interface réactive et rapide
- **SQLite** pour simplifier le développement sans configuration de base de données
- **JWT** pour la gestion sécurisée des sessions utilisateur