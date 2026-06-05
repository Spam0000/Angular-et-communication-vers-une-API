# Rick & Morty Explorer

Projet de synthese Angular (TP J5) base sur l'API Rick & Morty:
- REST API: https://rickandmortyapi.com/api
- Ressources: characters, locations, episodes

## Lancement

```bash
npm install
npm start
```

Application disponible sur:
- http://localhost:4200

## Fonctionnalites realisees

- [x] 5 modeles types (`Info`, `ApiResponse<T>`, `Character`, `Location`, `Episode`)
- [x] 5 services (`CharacterService`, `LocationService`, `EpisodeService`, `FavorisService`, `StorageService`)
- [x] 10 pages avec routing complet
- [x] Relations entre ressources:
- `character-detail` -> liens vers locations + episodes
- `location-detail` -> residents (characters)
- `episode-detail` -> characters
- [x] Recherche personnages avec `debounceTime(300)`, `distinctUntilChanged()`, `switchMap()`
- [x] Filtre status (alive/dead/unknown)
- [x] Pagination sur 3 listes (characters, locations, episodes)
- [x] Favoris persistants (localStorage)
- [x] Dashboard (totaux + stats favoris)
- [x] Formulaire contact reactive forms + validateurs + message succes
- [x] 5 composants dumb (OnPush)
- [x] 2 pipes (`status`, `truncate`)
- [x] Lazy loading pour `favoris` et `contact`
- [x] Page 404

## Architecture

```
src/app/
├── pages/
├── components/
├── services/
├── models/
├── pipes/
├── app.routes.ts
└── app.config.ts
```

## Design patterns utilises

- Singleton via `providedIn: 'root'`:
- Services uniques partages dans toute l'application.
- Smart vs Dumb components:
- Pages = smart (chargent les donnees), composants reutilisables = dumb (`character-card`, `paginator`, etc.).
- State management local par signals:
- `FavorisService` utilise `signal` + `computed` pour un etat reactif simple.
- Separation of concerns:
- API dans services, affichage dans composants/pages, transformation dans pipes.

## Reponses

1. Smart vs Dumb:
Les pages (ex: `characters-list`) sont smart car elles orchestrent la recherche/pagination/API. `CharacterCardComponent` est dumb: il affiche un personnage et emet un evenement de toggle favori sans connaitre la logique metier.

2. Pourquoi OnPush:
`OnPush` reduit les cycles de rendu en se basant sur les changements de references/inputs. Avec des donnees immuables (nouvelles references de tableaux/objets), le rendu est plus performant et previsible.

3. Pourquoi async pipe:
Le `async` pipe gere automatiquement abonnement/desabonnement. Il evite les fuites memoire liees aux `subscribe()` manuels non nettoyes.

4. `providedIn: 'root'`:
C'est le pattern Singleton pilote par l'injecteur Angular. Il existe une seule instance de `CharacterService` dans l'application.

5. Signal vs BehaviorSubject:
Un `signal` est nativement integre a Angular pour la reactivite UI; `BehaviorSubject` vient de RxJS pour les flux observables. Ici, le signal est tres adapte aux favoris (etat UI local + computed) avec moins de boilerplate.

6. Pourquoi switchMap + debounceTime:
`debounceTime` attend une pause de frappe avant l'appel API. `switchMap` annule la requete precedente si une nouvelle recherche arrive, ce qui evite les reponses obsoletes.

7. Reactive forms vs template-driven:
Reactive forms donne une validation declarative, testable et centralisee dans le TypeScript. C'est plus robuste pour des regles explicites (required, minlength, email).

8. Recuperation des relations:
Les relations sont des URLs dans les reponses. Les IDs sont extraits via `url.split('/').pop()`, puis utilises avec `getMany()` pour charger les episodes/residents/personnages.

9. Interet du lazy loading:
`favoris` et `contact` sont charges a la demande, ce qui reduit le bundle initial et accelere le premier affichage.

10. Bonus GraphQL vs REST:
Non implemente dans cette version. L'interet serait de recuperer personnage + location + episodes en une seule requete typable, au lieu de multiplier les appels REST.

## Captures obligatoires

Le dossier `screenshots/` est present. Ajouter les captures demandees:
- `01-characters-list.png`
- `02-recherche-filtre.png`
- `03-character-detail.png`
- `04-relations.png`
- `05-location-detail.png`
- `06-favoris.png`
- `07-dashboard.png`
- `08-contact-erreurs.png`
- `09-loading-erreur.png`
- `10-arborescence.png`
- `11-graphql.png` (bonus)
