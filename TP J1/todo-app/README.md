# 📝 TodoApp — TP 2 Angular Fondamentaux

Une application **TodoList complète** pour maîtriser les fondamentaux d'Angular: data binding, directives, services réactifs et communication parent-enfant.

## 🎯 Résultat final

![TodoList Présentation de l'interface](./Precision%20de%20L%27Interface.png)

Cette vue met en avant les principaux éléments de l'interface :

1. Le compteur des tâches restantes
2. Le compteur des tâches terminées
3. Le bouton d'effacement rapide des tâches terminées
4. La palette de couleurs de la page et la charte graphique générale

![TodoList Résultat](./Resultat%20Projet%20Finale.png)

**Caractéristiques visuelles**:
- ✨ Thème moderne: dégradé diagonal mauve sombre → rose clair
- 📋 En-tête avec titre, sous-titre et nuancier de couleurs
- ⚡ Formulaire d'ajout en temps réel
- 🔍 3 filtres: Toutes / Actives / Terminées
- ✅ Cases à cocher pour marquer complétées
- 🗑️ Supprimer des tâches individuellement
- 📱 Fully responsive

## 🚀 Lancer le projet

### Développement

```bash
# Installation des dépendances
npm install

# Lancer le serveur dev (auto-reload)
ng serve --open
```

L'app s'ouvre sur `http://localhost:4200`

### Build production

```bash
ng build
```

Les artifacts sont générés dans `dist/todo-app/`.

## 📚 Architecture du projet

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
├── app.ts                          ← Racine (importe TaskList)
└── styles.scss                     ← Styles globaux (thème violet/rose)
```

## 🧠 Concepts Angular couverts

| Concept | Utilisation |
|---------|------------|
| **Services** | `TaskService` pour la logique métier |
| **BehaviorSubject** | Gestion réactive des tâches |
| **@Input / @Output** | Communication parent-enfant |
| **EventEmitter** | Événements custom |
| **Data binding** | `{{ }}`, `[prop]`, `(event)`, `[(model)]` |
| **Directives** | `@if`, `@for`, `track` |
| **Pipes** | `async`, `date` |
| **RxJS** | `combineLatest`, `map`, `Observable` |
| **Injection DI** | `inject(TaskService)` |
| **Standalone components** | Tous les composants sans NgModule |

## 📦 Dépendances principales

- **Angular 17+**: Framework
- **RxJS**: Programmation réactive
- **TypeScript**: Typage statique
- **SCSS**: Styling avancé

## ✅ Fonctionnalités implémentées

- ✅ Ajouter une tâche
- ✅ Marquer comme terminée/réactiver
- ✅ Supprimer une tâche
- ✅ Filtrer les tâches (Toutes/Actives/Terminées)
- ✅ Affichage de la date de création (pipe `date`)
- ✅ Interface moderne et responsive
- ✅ Thème violet sombre + rose clair

## 🎨 Design & Thème

**Palette de couleurs**:
- Violet très sombre: `#120716` (haut-gauche du fond)
- Violet foncé: `#261033`, `#3a1f4c`, `#5f2a76`
- Rose clair: `#f2b9dc`, `#f8d3eb`, `#fde9f6`
- Rose quasi blanc: `#fffdfd` (bas-droite du fond)

**Dégradé principal**: 135° de mauve sombre à rose clair  
**Dégradé inversé** dans la fenêtre principale

## 💡 Prochaines étapes (Devoirs)

1. **Compteur de tâches**: Afficher "X tâches restantes"
2. **Effacer partout**: Bouton pour supprimer toutes les terminées
3. **Persistance**: Sauvegarder dans `localStorage`, récupérer au démarrage
4. **Animations**: Transitions d'entrée/sortie des tâches
5. **Statistiques**: Pourcentage de complétude
6. **Édition**: Double-cliquer pour modifier une tâche
7. **Export**: Télécharger les tâches en JSON/CSV

## 🔧 Commandes utiles

```bash
# Générer un composant
ng generate component my-component

# Générer un service
ng generate service my-service

# Tester
ng test

# Tests end-to-end
ng e2e

# Serveur en prod local
ng serve --configuration production
```

## 📚 Ressources

- 📖 [Angular Docs](https://angular.dev)
- 🔄 [RxJS Guide](https://rxjs.dev)
- ⌨️ [Angular CLI](https://angular.dev/tools/cli)
- 🎯 [Control Flow Syntax](https://angular.dev/guide/control-flow)

---

**Formation Angular — TP 2 Jour 2** ✨

Made by Spam
