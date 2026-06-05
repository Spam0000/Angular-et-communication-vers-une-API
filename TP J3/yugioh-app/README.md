# Yugioh App (TP J3)

Application Angular qui consomme l'API YGOPRODeck avec une architecture orientee services et modeles.

## Fonctionnalites
- Liste de cartes avec recherche et filtres.
- Page detail d'une carte (`/carte/:id`).
- Deck utilisateur (ajout/retrait) avec persistance localStorage.
- Page carte aleatoire.

## Structure
- `src/app/models/` : modeles types.
- `src/app/services/` : API, filtres, collection.
- `src/app/component/` : pages et UI.

## Commandes
```bash
npm install
npm start
npm run build
```

## URL
- Front : `http://localhost:4200`
