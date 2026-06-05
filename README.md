# Synthese pedagogique : ce qui a ete utilise dans les TPs

Ce document reprend les notions des cours du dossier Doc :
- [Doc/#00#-COURS-Angular-API.md](Doc/#00#-COURS-Angular-API.md)
- [Doc/#01#COURS-Jour2-Routage-API.md](Doc/#01#COURS-Jour2-Routage-API.md)
- [Doc/#02#API REST avec Spring Boot.md](Doc/#02#API%20REST%20avec%20Spring%20Boot.md)

et montre ou elles sont appliquees dans les projets TP J2, TP J3 et TP J4.

## 1) Architecture Angular moderne (standalone)

### Ce que dit le cours
- Composants standalone
- Configuration dans app.config.ts (pas de NgModule)
- Injection moderne avec inject()

### Ou c'est applique
- Configuration moderne avec Router + HttpClient :
	- [TP J2/POKE/pokedex/src/app/app.config.ts](TP%20J2/POKE/pokedex/src/app/app.config.ts)
	- [TP J4/tp6-digidex-graphql/P2/digidex-app/src/app/app.config.ts](TP%20J4/tp6-digidex-graphql/P2/digidex-app/src/app/app.config.ts)

### Exemple concret
Dans le Pokedex, on active :
- provideRouter(routes, withComponentInputBinding())
- provideHttpClient(withFetch())

Cela correspond exactement au style moderne du cours Jour 2.

## 2) Routage et navigation

### Ce que dit le cours
- Definir des routes dans app.routes.ts
- Utiliser routerLink
- Gerer une route dynamique : /ressource/:id
- Route fallback **

### Ou c'est applique
- Pokedex :
	- [TP J2/POKE/pokedex/src/app/app.routes.ts](TP%20J2/POKE/pokedex/src/app/app.routes.ts)
- Yu-Gi-Oh :
	- [TP J3/yugioh-app/src/app/app.routes.ts](TP%20J3/yugioh-app/src/app/app.routes.ts)

### Exemple concret
- Pokedex utilise /pokemon/:name pour la page detail.
- Yu-Gi-Oh utilise /carte/:id pour afficher une carte precise.

## 3) Parametres d'URL en version moderne (input)

### Ce que dit le cours
- Avec withComponentInputBinding(), les params arrivent directement dans input().
- Evite le style legacy snapshot/paramMap quand ce n'est pas necessaire.

### Ou c'est applique
- [TP J2/POKE/pokedex/src/app/component/pokemon-detail/pokemon-detail.ts](TP%20J2/POKE/pokedex/src/app/component/pokemon-detail/pokemon-detail.ts)

### Exemple concret
- name = input.required<string>() recupere le :name de l'URL.
- Le composant recharge le detail quand name change via toObservable + switchMap.

## 4) Services et injection de dependances

### Ce que dit le cours
- Mettre la logique metier et API dans des services
- Utiliser providedIn: 'root' pour un singleton
- Injecter avec inject()

### Ou c'est applique
- Service API Pokedex :
	- [TP J2/POKE/pokedex/src/app/services/pokemon-api.ts](TP%20J2/POKE/pokedex/src/app/services/pokemon-api.ts)
- Service CRUD Carnet :
	- [TP J2/CARNET/carnet-app/src/app/services/contact.ts](TP%20J2/CARNET/carnet-app/src/app/services/contact.ts)
- Service API Yu-Gi-Oh :
	- [TP J3/yugioh-app/src/app/services/card-api.service.ts](TP%20J3/yugioh-app/src/app/services/card-api.service.ts)

### Exemple concret
ContactService expose les 4 operations CRUD REST :
- getAll()
- create()
- update()
- delete()

## 5) Communication API REST (GET, POST, PUT, DELETE)

### Ce que dit le cours
- HttpClient retourne des Observable
- Chaque verbe HTTP a son role
- Typage avec des interfaces/modeles

### Ou c'est applique
- GET liste + GET detail Pokedex :
	- [TP J2/POKE/pokedex/src/app/services/pokemon-api.ts](TP%20J2/POKE/pokedex/src/app/services/pokemon-api.ts)
- CRUD complet en local avec json-server :
	- [TP J2/CARNET/carnet-app/src/app/services/contact.ts](TP%20J2/CARNET/carnet-app/src/app/services/contact.ts)
- REST avec params (filtres, pagination) :
	- [TP J3/yugioh-app/src/app/services/card-api.service.ts](TP%20J3/yugioh-app/src/app/services/card-api.service.ts)

### Exemple data
Dans Yu-Gi-Oh, HttpParams est utilise pour construire des requetes comme :
- fname
- type
- attribute
- archetype
- num / offset

C'est exactement la logique de communication API du cours #00 et #01.

## 6) RxJS et gestion de l'asynchrone

### Ce que dit le cours
- Les appels HTTP sont des Observable
- Utiliser map/switchMap pour transformer et enchainer
- Gestions loading/error/data

### Ou c'est applique
- map() pour transformer la liste brute PokeAPI en PokemonPreview :
	- [TP J2/POKE/pokedex/src/app/services/pokemon-api.ts](TP%20J2/POKE/pokedex/src/app/services/pokemon-api.ts)
- switchMap() dans le detail Pokemon pour relancer la requete selon le parametre URL :
	- [TP J2/POKE/pokedex/src/app/component/pokemon-detail/pokemon-detail.ts](TP%20J2/POKE/pokedex/src/app/component/pokemon-detail/pokemon-detail.ts)

### Exemple pedagogique
Quand l'URL passe de /pokemon/pikachu a /pokemon/evoli, switchMap annule l'ancien flux et charge le nouveau detail proprement.

## 7) State management avec signals

### Ce que dit le cours
- Partager l'etat entre composants/pages via service singleton
- Utiliser signal() et computed()

### Ou c'est applique
- Favoris Pokedex :
	- [TP J2/POKE/pokedex/src/app/services/favoris.ts](TP%20J2/POKE/pokedex/src/app/services/favoris.ts)

### Exemple concret
- _favoris = signal<string[]>([])
- nombre = computed(() => _favoris().length)
- basculer(name) ajoute/retire un pokemon des favoris

Tu retrouves ici exactement la partie "service + signals" du cours Jour 2.

## 8) Pattern architecture front : modeles + services + composants

### Ce que dit le cours
- Separer responsabilites :
	- modeles pour typer les donnees
	- services pour appels API
	- composants pour l'affichage

### Ou c'est applique
- Pokedex :
	- modeles : [TP J2/POKE/pokedex/src/app/models/pokemon.model.ts](TP%20J2/POKE/pokedex/src/app/models/pokemon.model.ts)
	- service : [TP J2/POKE/pokedex/src/app/services/pokemon-api.ts](TP%20J2/POKE/pokedex/src/app/services/pokemon-api.ts)
	- composants : [TP J2/POKE/pokedex/src/app/component](TP%20J2/POKE/pokedex/src/app/component)
- Yu-Gi-Oh :
	- modeles : [TP J3/yugioh-app/src/app/models](TP%20J3/yugioh-app/src/app/models)
	- service : [TP J3/yugioh-app/src/app/services/card-api.service.ts](TP%20J3/yugioh-app/src/app/services/card-api.service.ts)

## 9) GraphQL (TP J4) : extension de la communication API

### Lien avec le cours API REST
Le cours #02 explique l'architecture API (Controller/Service/Repository/Entity) et la communication HTTP JSON.
Dans TP J4, on applique la meme logique de separation, mais avec GraphQL :
- schema (contrat)
- resolvers (logique)
- datasource (acces donnees)

### Ou c'est applique
- Schema GraphQL :
	- [TP J4/tp6-digidex-graphql/P1/digidex-api/src/schema.js](TP%20J4/tp6-digidex-graphql/P1/digidex-api/src/schema.js)
- Demarrage serveur Apollo :
	- [TP J4/tp6-digidex-graphql/P1/digidex-api/src/index.js](TP%20J4/tp6-digidex-graphql/P1/digidex-api/src/index.js)
- Client Angular Apollo :
	- [TP J4/tp6-digidex-graphql/P2/digidex-app/src/app/services/digimon-graphql.service.ts](TP%20J4/tp6-digidex-graphql/P2/digidex-app/src/app/services/digimon-graphql.service.ts)

### Exemple data
Le service Angular envoie des queries GraphQL (LISTE, DETAIL) et mappe valueChanges pour recuperer des objets types DigimonPage/Digimon.

## 10) CORS et backend (cours Spring Boot #02)

### Ce que dit le cours
Quand front et back sont sur des ports differents (4200 / 8080), il faut une config CORS cote serveur.

### Application pratique dans les TPs
- Meme principe observe pour les TPs front qui appellent des API externes (PokeAPI, YGO API) ou locales (json-server, GraphQL local).
- En projet Spring Boot, tu appliquerais exactement la section CORS du cours #02 pour autoriser le front Angular.

## 11) Resume "ce que j'ai utilise"

1. Composants standalone Angular.
2. Routage moderne avec provideRouter + routes dynamiques.
3. Parametres de route en input() via withComponentInputBinding().
4. Services injectables avec inject().
5. HttpClient avec GET/POST/PUT/DELETE.
6. Typage des donnees avec modeles/interfaces.
7. RxJS (map, switchMap) pour les flux asynchrones.
8. Signals + computed pour l'etat partage (favoris).
9. Pattern separation front : modeles / services / composants.
10. GraphQL avec Apollo (schema, resolvers, queries).
11. Principes backend du cours Spring Boot : architecture en couches, CORS, logique API.

## 12) Guide de lecture conseille

1. Lire d'abord [Doc/#00#-COURS-Angular-API.md](Doc/#00#-COURS-Angular-API.md) pour la base Angular.
2. Continuer avec [Doc/#01#COURS-Jour2-Routage-API.md](Doc/#01#COURS-Jour2-Routage-API.md) pour le routage et l'API cote Angular.
3. Puis [Doc/#02#API REST avec Spring Boot.md](Doc/#02#API%20REST%20avec%20Spring%20Boot.md) pour la vision backend.
4. Enfin, comparer directement avec les fichiers de TP cites ci-dessus.




XXXXXX



# Synthèse des notions Angular, API REST et GraphQL utilisées dans les TPs

## Présentation

Dans le cadre des différents travaux pratiques réalisés durant ma formation, j'ai eu l'occasion de mettre en pratique de nombreuses notions abordées en cours autour d'Angular, des API REST, de Spring Boot et de GraphQL.

L'objectif de ce document est de faire le lien entre la théorie vue en cours et son application concrète dans les projets réalisés. Plutôt qu'une simple liste de concepts, cette synthèse présente comment chaque notion a été utilisée dans le code et ce qu'elle m'a permis de mettre en œuvre.

Les projets concernés sont :

* TP J2 : Pokedex et Carnet de contacts
* TP J3 : Application Yu-Gi-Oh
* TP J4 : Digidex GraphQL

Les références principales utilisées sont :

* Angular et communication API
* Routage Angular
* API REST avec Spring Boot

Chaque section présente la notion étudiée, son intérêt dans le développement d'une application ainsi que son implémentation dans les différents TPs.

---

# 1) Architecture Angular moderne (Standalone)

## Notion abordée

Le cours présente l'utilisation de l'architecture Angular moderne basée sur les composants standalone. Cette approche permet de simplifier la structure de l'application en supprimant l'utilisation des NgModules traditionnels.

Les principaux concepts étudiés sont :

* Les composants standalone
* La configuration de l'application via `app.config.ts`
* L'injection de dépendances avec `inject()`
* La déclaration centralisée des providers

## Mise en pratique

J'ai utilisé cette architecture dans plusieurs projets :

### Pokedex

* `TP J2/POKE/pokedex/src/app/app.config.ts`

### Digidex GraphQL

* `TP J4/tp6-digidex-graphql/P2/digidex-app/src/app/app.config.ts`

## Exemple concret

Dans le projet Pokedex, j'ai configuré :

* `provideRouter(routes, withComponentInputBinding())`
* `provideHttpClient(withFetch())`

Cette configuration correspond directement aux bonnes pratiques Angular modernes présentées dans le cours et permet de disposer d'une application plus légère et plus facile à maintenir.

---

# 2) Routage et navigation

## Notion abordée

Le routage permet de gérer la navigation entre les différentes pages d'une application.

Les éléments étudiés en cours sont :

* La définition des routes dans `app.routes.ts`
* L'utilisation de `routerLink`
* Les routes dynamiques avec paramètres
* Les routes de secours (`**`)

## Mise en pratique

### Pokedex

* `TP J2/POKE/pokedex/src/app/app.routes.ts`

### Yu-Gi-Oh

* `TP J3/yugioh-app/src/app/app.routes.ts`

## Exemple concret

Dans le projet Pokedex, j'ai mis en place une route dynamique permettant d'accéder au détail d'un Pokémon grâce à son nom :

```text
/pokemon/:name
```

Dans l'application Yu-Gi-Oh, j'ai utilisé le même principe pour afficher les détails d'une carte :

```text
/carte/:id
```

Cette mise en œuvre m'a permis de comprendre comment transmettre des informations via l'URL tout en conservant une navigation fluide dans l'application.

---

# 3) Paramètres d'URL avec Input Binding

## Notion abordée

Le cours présente l'utilisation de `withComponentInputBinding()` qui permet de transmettre automatiquement les paramètres d'une route directement dans les composants.

Cette approche évite l'utilisation des méthodes plus anciennes basées sur `snapshot` ou `paramMap`.

## Mise en pratique

### Pokedex

* `TP J2/POKE/pokedex/src/app/component/pokemon-detail/pokemon-detail.ts`

## Exemple concret

Dans ce composant, j'ai utilisé :

```typescript
name = input.required<string>()
```

Le paramètre présent dans l'URL est automatiquement récupéré et injecté dans le composant.

Grâce à cette approche, le composant recharge automatiquement les données lorsqu'un utilisateur navigue vers un autre Pokémon sans avoir à recharger la page.

---

# 4) Services et injection de dépendances

## Notion abordée

Les services permettent de centraliser la logique métier et les communications avec les API.

Les concepts étudiés sont :

* Les services Angular
* L'injection de dépendances
* Les services singleton avec `providedIn: 'root'`
* L'utilisation de `inject()`

## Mise en pratique

### Service API Pokedex

* `TP J2/POKE/pokedex/src/app/services/pokemon-api.ts`

### Service Carnet de contacts

* `TP J2/CARNET/carnet-app/src/app/services/contact.ts`

### Service API Yu-Gi-Oh

* `TP J3/yugioh-app/src/app/services/card-api.service.ts`

## Exemple concret

Dans le projet Carnet de contacts, j'ai développé un service dédié à la gestion des opérations CRUD.

Celui-ci expose les méthodes :

* `getAll()`
* `create()`
* `update()`
* `delete()`

Cette organisation permet de séparer clairement la logique métier de l'affichage.

---

# 5) Communication avec les API REST

## Notion abordée

Les API REST permettent aux applications de communiquer avec des services distants à l'aide du protocole HTTP.

Les notions étudiées sont :

* GET
* POST
* PUT
* DELETE
* HttpClient
* Typage des données

## Mise en pratique

### Pokedex

* Récupération de listes de Pokémon
* Récupération des détails d'un Pokémon

### Carnet de contacts

* CRUD complet via json-server

### Yu-Gi-Oh

* Recherche et filtrage avancés via API REST

## Exemple concret

Dans le projet Yu-Gi-Oh, j'ai utilisé `HttpParams` pour construire dynamiquement des requêtes contenant :

* Le nom de la carte
* Le type
* L'attribut
* L'archétype
* Les paramètres de pagination

Cette approche correspond directement aux mécanismes présentés dans les cours Angular API.

---

# 6) RxJS et gestion de l'asynchrone

## Notion abordée

Angular repose fortement sur RxJS pour gérer les traitements asynchrones.

Les principaux opérateurs étudiés sont :

* Observable
* map()
* switchMap()

## Mise en pratique

### Transformation de données

Dans le Pokedex, j'utilise `map()` pour transformer les données reçues depuis la PokeAPI en objets exploitables par l'application.

### Chaînage de requêtes

J'utilise également `switchMap()` pour recharger automatiquement les informations lorsqu'un paramètre de route change.

## Exemple concret

Lorsqu'un utilisateur passe d'une page Pokémon à une autre :

```text
/pokemon/pikachu
```

vers

```text
/pokemon/evoli
```

la requête précédente est automatiquement annulée et remplacée par la nouvelle.

Cela permet d'optimiser les performances et d'éviter des traitements inutiles.

---

# 7) Gestion d'état avec Signals

## Notion abordée

Les Signals permettent de partager et mettre à jour des données entre plusieurs composants de manière réactive.

Le cours présente notamment :

* `signal()`
* `computed()`

## Mise en pratique

### Gestion des favoris

* `TP J2/POKE/pokedex/src/app/services/favoris.ts`

## Exemple concret

Dans ce service, j'ai utilisé :

```typescript
signal<string[]>([])
```

pour stocker la liste des favoris.

J'ai également utilisé :

```typescript
computed()
```

afin de calculer automatiquement le nombre de favoris enregistrés.

Cette approche m'a permis de découvrir une alternative moderne à certaines utilisations classiques de RxJS pour la gestion d'état.

---

# 8) Architecture Front-End

## Notion abordée

Le cours insiste sur la séparation des responsabilités entre les différentes couches d'une application.

Les éléments sont répartis entre :

* Les modèles
* Les services
* Les composants

## Mise en pratique

### Pokedex

#### Modèles

* `pokemon.model.ts`

#### Services

* `pokemon-api.ts`

#### Composants

* `component/`

### Yu-Gi-Oh

Même organisation :

* Modèles
* Services
* Composants

## Bénéfices

Cette architecture facilite :

* La maintenance du projet
* La réutilisation du code
* Les évolutions futures
* Les tests

---

# 9) GraphQL (TP J4)

## Notion abordée

Après avoir travaillé avec les API REST, j'ai découvert GraphQL dans le TP Digidex.

GraphQL repose sur une logique différente :

* Un schéma central
* Des resolvers
* Des requêtes ciblées

## Mise en pratique

### Backend

* `schema.js`
* `index.js`

### Frontend

* `digimon-graphql.service.ts`

## Exemple concret

Depuis Angular, j'envoie des requêtes GraphQL afin de récupérer :

* Une liste de Digimon
* Le détail d'un Digimon

Les données sont ensuite transformées et intégrées dans les modèles de l'application.

Cette approche m'a permis de comparer directement REST et GraphQL dans un contexte concret.

---

# 10) CORS et Backend Spring Boot

## Notion abordée

Le cours Spring Boot présente la problématique du CORS lorsque le front-end et le back-end sont hébergés sur des ports différents.

Par exemple :

```text
Angular : localhost:4200
Spring Boot : localhost:8080
```

## Application pratique

Même si les TPs utilisent principalement :

* PokeAPI
* Yu-Gi-Oh API
* json-server
* Apollo GraphQL

j'ai pu comprendre l'importance de la configuration CORS pour permettre la communication entre plusieurs applications.

Cette notion sera essentielle lors du développement d'API Spring Boot plus complètes.

---

# 11) Ce que j'ai utilisé durant les TPs

À travers ces différents projets, j'ai utilisé :

1. Les composants standalone Angular.
2. Le routage moderne Angular.
3. Les routes dynamiques avec paramètres.
4. Les services et l'injection de dépendances.
5. HttpClient et les API REST.
6. Le typage avec des modèles TypeScript.
7. RxJS et les Observable.
8. Les Signals et Computed.
9. Une architecture séparée en modèles, services et composants.
10. GraphQL avec Apollo.
11. Les principes d'architecture backend étudiés avec Spring Boot.

---

# 12) Ordre de lecture conseillé

Pour comprendre progressivement les notions utilisées dans les TPs, je recommande l'ordre suivant :

1. Angular et communication API.
2. Routage Angular et architecture front-end.
3. API REST avec Spring Boot.
4. Analyse des projets TP afin de voir la mise en pratique de chaque notion.

Cette démarche permet de comprendre à la fois la théorie et son application concrète dans les projets réalisés durant la formation.
