# 📚 Formation Angular — TP Jour 1 & 2

Bienvenue! Ce dossier contient deux projets Angular qui couvrent les fondamentaux de la plateforme: de l'installation aux services réactifs avec **RxJS**.

---

## 📁 Structure des projets

```
TP J1/
├── mon-projet/          ← TP 1 : Installation & premiers composants
├── todo-app/            ← TP 2 : TodoList complète avec services
└── README.md            ← Ce fichier
```

---

## 🎯 TP 1 — Installation & Premiers Pas

### Objectif
Maîtriser l'installation d'Angular, comprendre la structure d'un projet, et créer ses premiers composants standalone.

### Concepts couverts
- Setup Node.js, npm, et Angular CLI
- Architecture d'un projet Angular 17+
- Composants standalone (`@Component`)
- Data binding avec interpolation (`{{ }}`)
- Structure HTML/CSS/TS des composants
- Injection de dépendances basique

### Projets réalisés

#### 📌 **Composant `hello`** — `src/app/hello/hello.ts`
Un composant affichant les propriétés d'une personne (prénom, âge).

```typescript
export class Hello {
  prenom = 'Mouad';
  age = 25;
}
```

**Template** :
```html
<div class="card">
  <h2>{{ prenom }}</h2>
  <p>Âge: {{ age }}</p>
</div>
```

**Concepts** : Interpolation `{{ }}`, propriétés de classe, standalone components.

#### 📌 **Composant `profil`** — `src/app/profil/profil.ts`
Un composant de profil avec une méthode de contact.

```typescript
export class Profil {
  nom = 'Mouad';
  metier = 'Fullstack Developer & Formateur IT';
  photo = 'https://i.pravatar.cc/150?img=12';

  contacter() {
    alert(`Contacter ${this.nom}`);
  }
}
```

**Concepts** : Méthodes de classe, event binding `(click)`, propriétés.

#### 📌 **App racine** — `src/app/app.ts`
Le composant principal qui importe et affiche les deux composants enfants.

```typescript
import { Hello } from './hello/hello';
import { Profil } from './profil/profil';

@Component({
  selector: 'app-root',
  imports: [Hello, Profil],
  templateUrl: './app.html'
})
export class App {
  title = 'mon-projet';
}
```

**Concepts** : Imports de composants, standalone apps, compositions.

### Lancer le projet

```bash
cd mon-projet
npm install        # Si pas déjà fait
ng serve --open    # Lance dev server sur http://localhost:4200
```

### Points clés appris
✅ Créer un composant avec `ng generate component` (ou `ng g c`)  
✅ Utiliser l'interpolation pour afficher des données  
✅ Organiser plusieurs composants dans une app  
✅ Comprendre la séparation HTML/CSS/TS  
✅ L'importance du `standalone: true` (Angular 17+)

---

## 🎯 TP 2 — Fondamentaux Avancés: TodoList complète

### Objectif
Maîtriser le **data binding**, les **directives modernes** (`@if`, `@for`), les **services** avec **RxJS/BehaviorSubject**, et la **communication parent-enfant** via `@Input`/`@Output`.

### Concepts couverts
- Toutes les formes de data binding (interpolation, property, event, two-way)
- Directives de contrôle de flux: `@if`, `@for`, `track`
- Services réactifs avec `BehaviorSubject`
- Observables avec `combineLatest` et `map`
- Communication parent ↔ enfant (`@Input`, `@Output`, `EventEmitter`)
- Pipe `async` pour s'abonner aux Observables
- Architectures modernes d'apps Angular

### Architecture du projet

```
src/app/
├── models/
│   └── task.model.ts              ← Interface Task
├── services/
│   └── task.service.ts            ← Logique métier, BehaviorSubject
├── component/
│   ├── task-form/                 ← Formulaire d'ajout
│   ├── task-item/                 ← Carte d'une tâche
│   └── task-list/                 ← Conteneur principal + filtres
├── app.ts                          ← Racine de l'app
└── styles.scss                     ← Styles globaux (thème violet/rose)
```

### Implémentation détaillée

#### 1️⃣ **Modèle** — `src/app/models/task.model.ts`

```typescript
export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
}
```

**Pourquoi?** Autocomplétion TypeScript + détection d'erreurs à la compilation.

#### 2️⃣ **Service** — `src/app/services/task.service.ts`

Le cœur réactif de l'app. Utilise `BehaviorSubject` pour exposer les tâches comme Observable.

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Apprendre Angular', done: false, createdAt: new Date() },
    { id: 2, title: 'Construire la TodoList', done: false, createdAt: new Date() }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      done: false,
      createdAt: new Date()
    };
    this.tasks = [...this.tasks, newTask];
    this.tasksSubject.next(this.tasks);
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.tasksSubject.next(this.tasks);
  }
}
```

**Concepts clés**:
- `BehaviorSubject` conserve la dernière valeur et la donne immédiatement aux nouveaux abonnés
- `.asObservable()` expose un Observable read-only (encapsulation)
- Immutabilité: création de nouveaux tableaux, pas de mutation directe
- `.next()` émet la nouvelle valeur à tous les abonnés

#### 3️⃣ **Composant: TaskForm** — `src/app/component/task-form/`

Formulaire pour ajouter une tâche. Utilise **two-way binding** `[(ngModel)]`.

```typescript
@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  newTitle = '';
  @Output() add = new EventEmitter<string>();

  onSubmit(): void {
    if (!this.newTitle.trim()) return;
    this.add.emit(this.newTitle);
    this.newTitle = '';
  }
}
```

**Template**:
```html
<form class="form" (ngSubmit)="onSubmit()">
  <input
    type="text"
    [(ngModel)]="newTitle"
    name="title"
    placeholder="Que dois-tu faire ?"
    required
  />
  <button type="submit">Ajouter</button>
</form>
```

**Concepts**:
- `[(ngModel)]` : two-way binding (TS ↔ HTML)
- `@Output()` : envoyer des données vers le parent
- `EventEmitter` : émettre un événement custom
- `(ngSubmit)` : event binding sur la soumission du formulaire

#### 4️⃣ **Composant: TaskItem** — `src/app/component/task-item/`

Carte d'une tâche. Reçoit la tâche en `@Input`, émet les actions en `@Output`.

```typescript
@Component({
  selector: 'app-task-item',
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}
```

**Template**:
```html
<li class="task" [class.done]="task.done">
  <input type="checkbox" [checked]="task.done" (change)="onToggle()" />
  <span class="title">{{ task.title }}</span>
  <small class="date">{{ task.createdAt | date: 'short' }}</small>
  <button class="delete-btn" (click)="onDelete()">Suppr</button>
</li>
```

**Concepts**:
- `@Input({ required: true })` : propriété requise, erreur à la compilation si oubliée
- `@Output()` : émettre des événements
- `[class.done]` : class binding conditionnel
- `[checked]` : property binding
- `{{ task.createdAt | date: 'short' }}` : utilisation du **pipe** `date`
- `(change)`, `(click)` : event binding

#### 5️⃣ **Composant: TaskList** — `src/app/component/task-list/`

Le composant parent qui orchestrate tout. **C'est le cœur** de cette TP!

```typescript
type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskFormComponent, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  private filterSubject = new BehaviorSubject<Filter>('all');
  filter$ = this.filterSubject.asObservable();

  // ⭐ Combine deux Observables: tâches + filtre
  filteredTasks$: Observable<Task[]> = combineLatest([
    this.taskService.getTasks(),
    this.filter$
  ]).pipe(
    map(([tasks, filter]) => {
      if (filter === 'active') return tasks.filter(t => !t.done);
      if (filter === 'done') return tasks.filter(t => t.done);
      return tasks;
    })
  );

  setFilter(filter: Filter): void {
    this.filterSubject.next(filter);
  }

  onAdd(title: string): void {
    this.taskService.addTask(title);
  }

  onToggle(id: number): void {
    this.taskService.toggleTask(id);
  }

  onDelete(id: number): void {
    this.taskService.deleteTask(id);
  }
}
```

**Concepts avanc(s**:
- `inject()` : injection de dépendances (plus élégant que le constructeur)
- `combineLatest([...])` : combine plusieurs Observables et émet quand l'un change
- `pipe()` : composition d'opérateurs RxJS
- `map()` : transformer les données émises
- Gestion réactive du filtre

**Template**:
```html
<div class="container">
  <header class="hero">
    <div>
      <p class="eyebrow">DASHBOARD</p>
      <h1>Ma TodoList</h1>
      <p class="subtitle">Une vraie liste propre, lisible et elegante.</p>
    </div>
    <div class="swatches" aria-label="Nuancier violet et rose">
      <span class="swatch swatch-violet-900"></span>
      <span class="swatch swatch-violet-700"></span>
      <span class="swatch swatch-pink-300"></span>
      <span class="swatch swatch-pink-200"></span>
    </div>
  </header>

  <app-task-form (add)="onAdd($event)"></app-task-form>

  <div class="filters">
    <button (click)="setFilter('all')" [class.active]="(filter$ | async) === 'all'">
      Toutes
    </button>
    <button (click)="setFilter('active')" [class.active]="(filter$ | async) === 'active'">
      Actives
    </button>
    <button (click)="setFilter('done')" [class.active]="(filter$ | async) === 'done'">
      Terminees
    </button>
  </div>

  @if (filteredTasks$ | async; as tasks) {
    @if (tasks.length === 0) {
      <p class="empty">Aucune tache a afficher.</p>
    } @else {
      <ul class="task-list">
        @for (task of tasks; track task.id) {
          <app-task-item
            [task]="task"
            (toggle)="onToggle($event)"
            (delete)="onDelete($event)">
          </app-task-item>
        }
      </ul>
    }
  }
</div>
```

**Concepts de template**:
- `{{ filter$ | async }}` : **pipe async** - s'abonne automatiquement et se désabonne quand le composant est détruit
- `@if (filteredTasks$ | async; as tasks)` : syntaxe de control flow Angular 17+ (remplace `*ngIf`)
- `@for (task of tasks; track task.id)` : syntaxe de control flow (remplace `*ngFor`), `track` optimise le rendu
- `[task]="task"` : **property binding** enfant
- `(toggle)="onToggle($event)"` : **event binding** enfant

### Styling: Thème Violet Sombre / Rose Clair

Le projet utilise une palette moderne avec dégradé diagonal:
- **Haut gauche**: Mauve très sombre (`#120716`)
- **Bas droite**: Rose très clair (`#fffdfd`)
- **Fenêtre principale**: Dégradé inversé (rose vers mauve)

**Fichiers de style**:
- `src/styles.scss` : styles globaux avec palette CSS variables
- Chaque composant a son propre `.scss` avec responsive mobile

### Fonctionnalités implémentées

✅ Ajouter une tâche  
✅ Marquer comme terminée / réactiver  
✅ Supprimer une tâche  
✅ Filtrer: Toutes / Actives / Terminées  
✅ Affichage de la date de création (pipe `date`)  
✅ Responsive mobile  
✅ Interface moderne et élégante

### Lancer le projet

```bash
cd todo-app
npm install        # Si pas déjà fait
ng serve --open    # Lance dev server
```

La TodoList s'ouvre sur `http://localhost:4200`. Essayez d'ajouter, filtrer et marquer des tâches!

---

## 🧠 Concepts clés couverts

| Concept | TP 1 | TP 2 | Fichier |
|---------|------|------|---------|
| Composants standalone | ✅ | ✅ | `*.ts` |
| Interpolation `{{ }}` | ✅ | ✅ | `*.html` |
| Property binding `[prop]` | ❌ | ✅ | `task-item.component.html` |
| Event binding `(event)` | ❌ | ✅ | `task-form.component.html` |
| Two-way binding `[(model)]` | ❌ | ✅ | `task-form.component.html` |
| Class binding `[class.name]` | ❌ | ✅ | `task-item.component.html` |
| `@Input` / `@Output` | ❌ | ✅ | `task-item.component.ts` |
| `@if` / `@for` directives | ❌ | ✅ | `task-list.component.html` |
| Services & dependency injection | ❌ | ✅ | `task.service.ts` |
| RxJS: `BehaviorSubject`, `Observable` | ❌ | ✅ | `task.service.ts` |
| RxJS: `combineLatest`, `map` | ❌ | ✅ | `task-list.component.ts` |
| Pipes (`async`, `date`) | ❌ | ✅ | `task-list.component.html` |
| Component composition | ✅ | ✅ | `app.ts` |

---

## 🚀 Améliorations possibles (Devoirs)

### Pour TP 1
- Ajouter un formulaire pour modifier le profil
- Afficher une liste de profils
- Utiliser `@for` pour boucler sur les profils

### Pour TP 2
- **Compteur**: Ajouter "X tâches restantes" sous la liste
- **Effacer partout**: Bouton "Effacer toutes les terminées"
- **Persistance**: Sauvegarder dans `localStorage` et récupérer au démarrage
- **Animations**: Ajouter des transitions `@angular/animations` quand une tâche apparaît/disparaît
- **Statistiques**: Afficher le pourcentage de tâches complétées
- **Export**: Permettre d'exporter les tâches en JSON/CSV
- **Editer une tâche**: Double-cliquer pour éditer une tâche

---

## 📚 Ressources utiles

- **Docs officielles**: https://angular.dev
- **Angular CLI**: https://angular.dev/tools/cli
- **RxJS Guide**: https://rxjs.dev
- **Control Flow**: https://angular.dev/guide/control-flow
- **Services & DI**: https://angular.dev/guide/di

---

## 💡 Conseils pour continuer

1. **Lire le code**: Parcourez les fichiers dans ce README, cherchez à comprendre chaque ligne
2. **Expérimenter**: Modifiez les valeurs, les styles, lancez le app en dev
3. **Déboguer**: Ouvrez DevTools, utilisez `console.log()` pour tracer
4. **Faire les devoirs**: Les améliorations ci-dessus sont excellentes pour consolider
5. **Créer votre propre app**: Une app d'habitudes, de budget, de notes...

---

**Bonne chance!** 🎉

Créé pour la formation Angular — Jour 1 & 2
