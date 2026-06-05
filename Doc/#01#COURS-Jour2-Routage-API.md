# 📘 Jour 2 — Cours : Routage, Navigation & Communication API (version moderne)

> **Module IPSSI** — Angular & communication API
> **Version** : Angular **19 / 20 / 21** (dernière stable 2026 : **Angular 21**).
> **Style** : moderne 2026 — **signals**, `inject()`, `provideRouter` / `provideHttpClient`, **route → `input()` binding**, **`@if/@for`**.
> ⚠️ On évite le **legacy** : pas de NgModule, pas de `RouterModule.forRoot()`, pas de `HttpClientModule`, pas de `ActivatedRoute.snapshot` quand on peut faire mieux. Tableau legacy/moderne à la fin.

---

## 🎯 Objectifs de la journée

À la fin du Jour 2, tu sauras :

1. Configurer le **Router** et naviguer entre plusieurs **pages**.
2. Créer des **liens** (`routerLink`) et naviguer **par code** (`Router.navigate`).
3. **Passer des paramètres** dans l'URL et les **récupérer** (la façon moderne : en `input()`).
4. Lire les **query params** (`?search=pikachu`).
5. Partager de l'**état** entre composants/pages via un **service + signals**.
6. Appeler une **API REST** avec **`HttpCommand 'markdown.togglePreview' not foundlient`** : **GET, POST, PUT, DELETE**.
7. Gérer l'**asynchrone** (chargement / erreur) avec **RxJS** et **signals**.
8. Comprendre `switchMap`, `toSignal`, et le pont RxJS ↔ signals.

---

## 1. Le Routing : afficher des pages différentes selon l'URL

Une **SPA** (Single Page Application) ne recharge jamais la page. Le **Router** d'Angular regarde l'URL et affiche le bon composant **à la place** de `<router-outlet>`.

```
URL : /                 →  <router-outlet> affiche HomeComponent
URL : /pokemon          →  <router-outlet> affiche PokemonListComponent
URL : /pokemon/pikachu  →  <router-outlet> affiche PokemonDetailComponent
```

### 1.1 Définir les routes — `app.routes.ts`

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '',       component: HomeComponent },        // page d'accueil
  { path: 'about',  component: AboutComponent },        // /about
  { path: '**',     redirectTo: '' },   
                 // 404 → accueil
];
```

| Élément | Rôle |
|---|---|
| `path: ''` | l'URL racine `/` |
| `path: 'about'` | l'URL `/about` |
| `path: '**'` | **toutes les autres** URL (404), à mettre **en dernier** |
| `redirectTo` | redirige vers une autre route |

### 1.2 Activer le Router — `app.config.ts`

> 🆕 **Style moderne** : on configure tout dans `app.config.ts` avec `provideRouter()`. **Plus de `RouterModule.forRoot()`** (legacy).

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    //                    ↑ permet de recevoir les params d'URL en input() (voir §3)
  ],
};
```

### 1.3 Afficher la page courante — `<router-outlet>`

Dans `app.component.html` :

```html
<nav>
  <a routerLink="/">Accueil</a>
  <a routerLink="/about">À propos</a>
</nav>

<router-outlet />   <!-- la page change ici selon l'URL -->
```

Et dans `app.component.ts`, importer `RouterOutlet` et `RouterLink` :

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],   // ← nécessaires pour <router-outlet> et routerLink
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

---

## 2. Naviguer : liens et navigation par code

### 2.1 Avec un lien — `routerLink`

```html
<a routerLink="/about">À propos</a>

<!-- chemin dynamique : tableau de segments -->
<a [routerLink]="['/pokemon', pokemon.name]">Voir {{ pokemon.name }}</a>
<!-- → /pokemon/pikachu -->
```

> ❌ N'utilise **jamais** `<a href="/about">` dans une SPA : ça **recharge** toute la page. ✅ Utilise `routerLink`.

### 2.2 Lien actif — `routerLinkActive`

Ajoute une classe CSS quand le lien correspond à l'URL courante :

```html
<a routerLink="/about" routerLinkActive="actif">À propos</a>
```

### 2.3 Naviguer par code — `Router.navigate()`

Utile après une action (ex : après avoir soumis un formulaire) :

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ /* ... */ })
export class SearchComponent {
  private router = inject(Router);

  rechercher(nom: string) {
    // navigue vers /pokemon/pikachu
    this.router.navigate(['/pokemon', nom]);
  }
}
```

---

## 3. Passer et récupérer des paramètres d'URL ⭐

### 3.1 Les deux types de paramètres

```  
/pokemon/pikachu          →  paramètre de ROUTE  (:name)   → obligatoire, identifie la ressource
/pokemon?type=feu&page=2  →  QUERY params                  → optionnels, filtres/options
```

### 3.2 Déclarer un paramètre de route

```typescript
// app.routes.ts
{ path: 'pokemon/:name', component: PokemonDetailComponent },
//               ↑ paramètre nommé "name"
```

### 3.3 Le récupérer — la façon MODERNE : en `input()` 🆕

Grâce à `withComponentInputBinding()` (activé au §1.2), **le paramètre arrive directement comme un `input()`** portant le même nom. Plus besoin de s'abonner à `ActivatedRoute` !

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pokemon-detail',
  template: `<h1>{{ name() }}</h1>`,
})
export class PokemonDetailComponent {
  // le param d'URL :name arrive ici automatiquement
  name = input.required<string>();
}
```

> ✅ **C'est la méthode recommandée aujourd'hui** : simple, typée, réactive (le signal `name()` change tout seul si l'URL change).

### 3.4 Les query params en `input()`

Même principe — `/pokemon?type=feu` :

```typescript
type = input<string>();    // input optionnel → undefined si absent
```

### 3.5 (Pour info) L'ancienne façon — `ActivatedRoute`

Tu la verras dans d'anciens projets. À **connaître**, mais à **ne plus écrire** par défaut :

```typescript
// ❌ legacy / verbeux
import { ActivatedRoute } from '@angular/router';

private route = inject(ActivatedRoute);

ngOnInit() {
  // snapshot : lu une seule fois
  const name = this.route.snapshot.paramMap.get('name');

  // ou en observable (si le param peut changer sans recréer le composant) :
  this.route.paramMap.subscribe(params => {
    const name = params.get('name');
  });
}
```

> 💡 `input()` remplace ça avantageusement dans 90 % des cas.

---

## 4. Partager l'état entre pages : Service + Signals

Quand on navigue, les composants sont **détruits et recréés**. Pour **garder** des données (panier, favoris, utilisateur connecté…), on les met dans un **service singleton** (`providedIn: 'root'`) avec des **signals**.

```typescript
// services/favoris.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private _favoris = signal<string[]>([]);

  favoris = this._favoris.asReadonly();              // lecture seule
  nombre  = computed(() => this._favoris().length);  // dérivé

  ajouter(nom: string) {
    this._favoris.update(list =>
      list.includes(nom) ? list : [...list, nom]
    );
  }

  retirer(nom: string) {
    this._favoris.update(list => list.filter(n => n !== nom));
  }

  estFavori(nom: string): boolean {
    return this._favoris().includes(nom);
  }
}
```

N'importe quelle page injecte ce service et voit **la même donnée** :

```typescript
private favoris = inject(FavorisService);
// dans le template : {{ favoris.nombre() }}
```

> 🔁 **Rappel `input()` / `output()`** (Jour 2) : pour communiquer **parent ↔ enfant immédiat**, on utilise `input()` (descendre) et `output()` (remonter). Pour partager entre **pages éloignées**, on utilise un **service**. Les deux sont complémentaires.

---

## 5. Communiquer avec une API : `HttpClient` ⭐⭐

C'est le cœur du Jour 2. Une **API REST** expose des données via des URL et des **verbes HTTP**.

```
GET    /users/   → LIRE   la liste
GET    /users/42    → LIRE   un élément
POST   /users        → CRÉER  un élément
PUT    /users/42     → MODIFIER (remplacer) un élément
PATCH  /users/42     → MODIFIER partiellement
DELETE /users/42     → SUPPRIMER un élément
```


### 5.1 Activer HttpClient — `app.config.ts`

> 🆕 **Style moderne** : `provideHttpClient(withFetch())`. **Plus de `HttpClientModule`** (legacy).

```typescript
// app.config.ts
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),     // ← active HttpClient (basé sur fetch)
  ],
};
```

### 5.2 Le typage : toujours une interface

```typescript
// models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### 5.3 Un service qui appelle l'API

> 🔑 **Bonne pratique** : les appels HTTP vivent dans un **service**, jamais directement dans le composant.

```typescript
// services/user-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com/users';

  // GET liste
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // GET un élément
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // POST créer
  create(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  // PUT modifier
  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  // DELETE supprimer
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

> 📌 `HttpClient` renvoie **toujours un Observable**. ⚠️ **Tant que personne ne s'abonne (`subscribe`) ou que le pipe `async` / `toSignal` ne le consomme pas, AUCUN appel HTTP n'est envoyé.** Un Observable est « paresseux » (lazy).

---

## 6. Consommer un Observable dans un composant

Deux approches modernes. La n°2 (signals) est la plus propre.

### 6.1 Approche `subscribe` (la plus explicite)

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { UserApiService } from '../services/user-api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  template: `
    @if (loading()) {
      <p>⏳ Chargement…</p>
    } @else if (error()) {
      <p>❌ {{ error() }}</p>
    } @else {
      <ul>
        @for (u of users(); track u.id) {
          <li>{{ u.name }} — {{ u.email }}</li>
        } @empty {
          <li>Aucun utilisateur</li>
        }
      </ul>
    }
  `,
})
export class UsersComponent implements OnInit {
  private api = inject(UserApiService);

  users   = signal<User[]>([]);
  loading = signal(true);
  error   = signal<string | null>(null);

  ngOnInit() {
    this.api.getAll().subscribe({
      next:  data => { this.users.set(data); this.loading.set(false); },
      error: err  => { this.error.set('Erreur de chargement'); this.loading.set(false); },
    });
  }
}
```

> 💡 **Le pattern `loading` / `error` / `data`** : c'est le réflexe à avoir pour TOUT appel API. L'utilisateur doit toujours savoir s'il attend, s'il y a une erreur, ou si les données sont là.

### 6.2 Approche `toSignal` (la plus concise)

`toSignal()` transforme un Observable en signal et **se désabonne tout seul** à la destruction du composant.

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserApiService } from '../services/user-api.service';

@Component({
  selector: 'app-users',
  template: `
    <ul>
      @for (u of users(); track u.id) {
        <li>{{ u.name }}</li>
      }
    </ul>
  `,
})
export class UsersComponent {
  private api = inject(UserApiService);

  // initialValue = [] le temps que la requête réponde
  users = toSignal(this.api.getAll(), { initialValue: [] });
}
```

### 6.3 Un appel qui dépend d'un paramètre réactif — `switchMap`

Cas typique : une page de détail dont l'URL change. On combine le signal `input()` du param avec l'appel HTTP.

```typescript
import { Component, input, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserApiService } from '../services/user-api.service';

@Component({ /* ... */ })
export class UserDetailComponent {
  private api = inject(UserApiService);

  id = input.required<number>();   // vient de l'URL /users/:id

  // à chaque changement de id(), on relance l'appel et on annule le précédent
  user = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.api.getById(id))
    )
  );
}
```

> 🔑 **`switchMap`** : quand une nouvelle valeur arrive (nouvel `id`), il **annule** la requête en cours et lance la nouvelle. Idéal pour la recherche et les pages de détail (évite les réponses obsolètes).

---

## 7. POST / PUT / DELETE en pratique

Ces verbes **modifient** des données. Après l'appel, on **rafraîchit** l'état local.

```typescript
@Component({ /* ... */ })
export class UserManagerComponent {
  private api = inject(UserApiService);
  users = signal<User[]>([]);

  // CRÉER
  ajouter() {
    this.api.create({ name: 'Nouveau', email: 'new@mail.com' }).subscribe(cree => {
      this.users.update(list => [...list, cree]);   // maj optimiste de l'UI
    });
  }

  // MODIFIER
  renommer(user: User) {
    this.api.update(user.id, { ...user, name: 'Modifié' }).subscribe(maj => {
      this.users.update(list => list.map(u => u.id === maj.id ? maj : u));
    });
  }

  // SUPPRIMER
  supprimer(id: number) {
    this.api.delete(id).subscribe(() => {
      this.users.update(list => list.filter(u => u.id !== id));
    });
  }
}
```

> ⚠️ **Gestion d'erreur** : en vrai, on ajoute `error:` à chaque `subscribe`, ou un opérateur `catchError` dans le service. Ne jamais ignorer les erreurs réseau.

---

## 8. RxJS : les opérateurs utiles du Jour 2

On reste sur l'essentiel — on les utilise dans un `.pipe(...)`.

| Opérateur | Rôle | Exemple d'usage |
|---|---|---|
| `map` | transformer la valeur | extraire un champ de la réponse |
| `switchMap` | enchaîner un nouvel appel, **annuler** le précédent | recherche, page de détail |
| `debounceTime` | attendre une pause avant d'émettre | barre de recherche (frappe clavier) |
| `catchError` | intercepter une erreur | renvoyer une valeur de secours |
| `tap` | effet de bord (log) sans modifier le flux | déboguer |

**Exemple : recherche avec debounce** (search-as-you-type) :

```typescript
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs';

terme = signal('');

resultats = toSignal(
  toObservable(this.terme).pipe(
    debounceTime(300),                          // attend 300ms de pause
    switchMap(q => this.api.search(q))          // relance l'appel, annule l'ancien
  ),
  { initialValue: [] }
);
```

> 🌉 **À retenir** : **état local = signals**, **flux/asynchrone réseau = Observables**, et on fait le pont avec **`toSignal` / `toObservable`**.

---

## 9. Legacy ❌ vs Moderne ✅ — Jour 2

| Concept | ❌ Legacy | ✅ Moderne 2026 |
|---|---|---|
| Config routes | `RouterModule.forRoot(routes)` | **`provideRouter(routes)`** |
| Activer HTTP | `imports: [HttpClientModule]` | **`provideHttpClient(withFetch())`** |
| Lire un param d'URL | `route.snapshot.paramMap.get('id')` | **`input()`** (+ `withComponentInputBinding`) |
| Récupérer données async | `subscribe` + variable + `ngOnDestroy` | **`toSignal()`** (désabonnement auto) |
| Afficher liste async | `*ngFor` + pipe `async` | **`@for`** + signal (ou `toSignal`) |
| Injection | constructeur | **`inject()`** |
| Lien | `<a href>` (recharge ❌) | **`routerLink`** |

> 🧪 **Pour aller plus loin (cutting-edge)** : Angular introduit des API « resource » signal-natives pour le fetch — `httpResource()` et `rxResource()` (`@angular/core/rxjs-interop`). Elles exposent directement `.value()`, `.isLoading()`, `.error()` en signals. Encore en stabilisation selon la version : on les présente en bonus, on garde `HttpClient` + `toSignal` comme base solide pour le TP.

---

## 🧠 Quiz de fin de cours

1. À quoi sert `<router-outlet>` ?
2. Pourquoi `routerLink` et pas `href` ?
3. Comment récupérer le paramètre `:name` d'une URL, en moderne ?
4. Quelle fonction remplace `HttpClientModule` ?
5. Pourquoi un appel `HttpClient` ne part-il pas tant qu'on ne fait pas `subscribe` (ou `toSignal`) ?
6. À quoi sert `switchMap` ?
7. Quel trio de signals affiche-t-on pour tout appel API ?

<details>
<summary>👀 Réponses</summary>

1. C'est l'emplacement où le Router affiche le composant correspondant à l'URL courante.
2. `href` recharge toute la page (on perd l'avantage SPA) ; `routerLink` navigue côté client sans rechargement.
3. En le déclarant comme `input.required<string>()` du même nom, avec `provideRouter(routes, withComponentInputBinding())`.
4. `provideHttpClient(withFetch())`.
5. Un Observable est paresseux (lazy) : il ne s'exécute qu'au moment où quelqu'un s'y abonne.
6. Enchaîner un nouvel appel à partir d'une valeur, en **annulant** la requête précédente (recherche, détail).
7. `loading` (chargement), `error` (erreur), et la donnée (`data`/liste).

</details>

---

➡️ **Place au TP : on construit un Pokédex avec la PokéAPI** (liste + page détail + recherche + favoris). Voir `TP-03-Pokedex.md`.
