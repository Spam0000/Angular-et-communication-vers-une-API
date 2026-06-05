# 🌱 TP — API REST avec Spring Boot (Gestion de Produits)

> **Objectif** : construire une **vraie API REST** en **Java / Spring Boot**, avec une architecture **en couches** professionnelle, une base de données **H2** (zéro installation) et les **4 verbes HTTP** (GET, POST, PUT, DELETE).
>
> Cette API sera ensuite consommée par une application **Angular** (voir le TP `produits-app`). C'est exactement le fonctionnement d'une appli web moderne : un **back-end** (Spring Boot) + un **front-end** (Angular) qui se parlent en **JSON** via HTTP.

---

## 🎯 Ce que tu vas construire

Une API qui gère un catalogue de **produits** (nom, prix, stock, catégorie) avec les endpoints suivants :

| Méthode | URL | Rôle | Code succès |
|---|---|---|---|
| `GET`    | `/api/produits`      | Lister tous les produits | `200 OK` |
| `GET`    | `/api/produits/{id}` | Récupérer un produit     | `200 OK` |
| `POST`   | `/api/produits`      | Créer un produit         | `201 Created` |
| `PUT`    | `/api/produits/{id}` | Modifier un produit      | `200 OK` |
| `DELETE` | `/api/produits/{id}` | Supprimer un produit     | `204 No Content` |

---

## 🏛️ L'architecture en couches (à comprendre AVANT de coder)

Une API Spring Boot bien faite est organisée en **couches**, chacune avec un rôle précis. Une requête HTTP traverse les couches de haut en bas :

```
   📱 Client (Angular, navigateur, Postman...)
        │  requête HTTP + JSON
        ▼
┌─────────────────────────────────────────┐
│  CONTROLLER  (@RestController)            │  ← reçoit la requête HTTP, renvoie le JSON
│  "À quelle URL je réponds ?"              │
└───────────────────┬─────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│  SERVICE  (@Service)                      │  ← logique métier (règles, vérifications)
│  "Que faut-il FAIRE concrètement ?"       │
└───────────────────┬─────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│  REPOSITORY  (JpaRepository)              │  ← accès aux données (SQL automatique)
│  "Comment je lis/écris en base ?"         │
└───────────────────┬─────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│  ENTITY  (@Entity)  ──►  Base H2          │  ← une classe Java = une table
└─────────────────────────────────────────┘
```

> 🔑 **Pourquoi séparer ?** Chaque couche a **une seule responsabilité**. Si demain on change de base de données, seul le Repository bouge. Si une règle métier change, seul le Service bouge. C'est plus clair, plus testable, plus maintenable.

### Arborescence finale du projet

```
produits-api/
├── pom.xml                          ← dépendances Maven
└── src/main/
    ├── java/com/formation/produits/
    │   ├── ProduitsApiApplication.java   ← point d'entrée (main)
    │   ├── model/Produit.java            ← l'entité (la table)
    │   ├── repository/ProduitRepository.java  ← accès données
    │   ├── service/ProduitService.java        ← logique métier
    │   ├── controller/ProduitController.java   ← les endpoints REST
    │   └── config/CorsConfig.java              ← autorise Angular à appeler l'API
    └── resources/
        ├── application.properties        ← config (base, port...)
        └── data.sql                      ← données de départ
```

---

## 🧰 Prérequis

Vérifie que tu as **Java 17+** et **Maven** :

```bash
java -version    # doit afficher 17 ou plus
mvn -version     # doit afficher Apache Maven 3.x
```

> 💡 Si Java n'est pas installé : `sudo apt install openjdk-17-jdk maven` (Linux/WSL).

---

## 🚀 ÉTAPE 0 — Générer le squelette du projet

Le plus simple : **Spring Initializr**, un générateur officiel.

1. Va sur **<https://start.spring.io>**
2. Configure :
   - **Project** : Maven
   - **Language** : Java
   - **Spring Boot** : 3.3.x (la plus récente stable en 3.x)
   - **Group** : `com.formation`
   - **Artifact** : `produits-api`
   - **Packaging** : Jar
   - **Java** : 17
3. **Add Dependencies** (bouton à droite) — ajoute ces 4 :
   - **Spring Web** (pour créer l'API REST)
   - **Spring Data JPA** (pour parler à la base sans SQL)
   - **H2 Database** (base en mémoire)
   - **Validation** (pour valider les champs)
4. Clique **GENERATE** → un `.zip` se télécharge.
5. Décompresse-le dans `tp5-spring-angular/` (remplace le dossier `produits-api`).

> 🛠️ **Alternative en ligne de commande** (si `curl` dispo) :
> ```bash
> curl https://start.spring.io/starter.zip \
>   -d dependencies=web,data-jpa,h2,validation \
>   -d type=maven-project -d language=java -d javaVersion=17 \
>   -d groupId=com.formation -d artifactId=produits-api \
>   -d name=produits-api -d packageName=com.formation.produits \
>   -o produits-api.zip && unzip produits-api.zip -d produits-api
> ```

### Le `pom.xml` attendu (vérifie tes dépendances)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- On hérite du "parent" Spring Boot : il fixe des versions cohérentes. -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.formation</groupId>
    <artifactId>produits-api</artifactId>
    <version>1.0.0</version>
    <name>produits-api</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

> 📌 Le **`spring-boot-starter-parent`** centralise toutes les versions : tu n'écris pas de numéro de version sur chaque dépendance, elles sont déjà compatibles.

---

## ⚙️ ÉTAPE 1 — La configuration (`application.properties`)

Fichier `src/main/resources/application.properties` :

```properties
# Nom de l'application
spring.application.name=produits-api

# Port du serveur (par défaut 8080)
server.port=8080

# --- Base de données H2 en mémoire ---
# "mem" = en mémoire vive : remise à zéro à chaque redémarrage (parfait pour un TP)
spring.datasource.url=jdbc:h2:mem:produitsdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# --- JPA / Hibernate ---
# create-drop : crée les tables au démarrage, les supprime à l'arrêt
spring.jpa.hibernate.ddl-auto=create-drop
# Affiche le SQL généré dans la console (pédagogique)
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# --- Console H2 : interface web pour voir la base ---
# Accessible sur http://localhost:8080/h2-console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Exécute data.sql APRÈS la création des tables par Hibernate
spring.jpa.defer-datasource-initialization=true
```

> 🔑 **`ddl-auto=create-drop`** : Hibernate **génère les tables tout seul** à partir de tes entités Java. Tu n'écris **aucun** `CREATE TABLE`. Idéal pour apprendre.

---

## 📦 ÉTAPE 2 — L'entité `Produit`

Une **entité** = une classe Java qui correspond à une **table**. Fichier `model/Produit.java` :

```java
package com.formation.produits.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity // ← dit à Hibernate : "crée une table PRODUIT pour cette classe"
public class Produit {

    // Clé primaire, auto-incrémentée (1, 2, 3...) par la base
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire") // refuse "" ou null
    private String nom;

    @Min(value = 0, message = "Le prix ne peut pas être négatif")
    private double prix;

    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private int stock;

    private String categorie;

    // JPA EXIGE un constructeur vide
    public Produit() {
    }

    public Produit(String nom, double prix, int stock, String categorie) {
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
        this.categorie = categorie;
    }

    // --- Getters / Setters (obligatoires pour la conversion JSON) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
}
```

> 📌 **Pourquoi les getters/setters ?** Spring convertit automatiquement l'objet Java ↔ JSON (grâce à Jackson). Pour lire/écrire les champs `private`, il a besoin de ces méthodes publiques.
>
> 💡 **Astuce pro** : la bibliothèque **Lombok** génère les getters/setters automatiquement avec `@Data`. On les écrit ici à la main pour bien comprendre.

---

## 🗄️ ÉTAPE 3 — Le `Repository` (accès aux données)

C'est ici que la magie de **Spring Data JPA** opère. Fichier `repository/ProduitRepository.java` :

```java
package com.formation.produits.repository;

import com.formation.produits.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// On hérite de JpaRepository<TypeEntité, TypeDeLId>
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    // Spring DEVINE le SQL à partir du nom de la méthode !
    // -> SELECT * FROM produit WHERE categorie = ?
    List<Produit> findByCategorie(String categorie);

    // -> SELECT * FROM produit WHERE LOWER(nom) LIKE LOWER('%mot%')
    List<Produit> findByNomContainingIgnoreCase(String mot);
}
```

> 🤯 **C'est une interface VIDE, et pourtant elle marche !** En héritant de `JpaRepository`, tu obtiens **gratuitement** : `findAll()`, `findById(id)`, `save(p)`, `deleteById(id)`, `count()`, `existsById(id)`...
>
> 🔑 Les méthodes `findBy...` sont des **requêtes dérivées** : Spring lit le nom de la méthode et génère le SQL automatiquement. Pas une ligne de SQL à écrire.

---

## 🧠 ÉTAPE 4 — Le `Service` (logique métier)

Le Service contient les **règles métier** et orchestre les appels au Repository. Fichier `service/ProduitService.java` :

```java
package com.formation.produits.service;

import com.formation.produits.model.Produit;
import com.formation.produits.repository.ProduitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service // ← Spring crée UNE instance (bean) de cette classe et l'injecte où besoin
public class ProduitService {

    private final ProduitRepository repository;

    // INJECTION DE DÉPENDANCE : Spring fournit automatiquement le repository
    // via le constructeur. Pas de "new ProduitRepository()" à faire.
    public ProduitService(ProduitRepository repository) {
        this.repository = repository;
    }

    // READ : tous les produits
    public List<Produit> findAll() {
        return repository.findAll();
    }

    // READ : un produit par id (ou erreur 404 si introuvable)
    public Produit findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Produit " + id + " introuvable"));
    }

    // CREATE
    public Produit create(Produit produit) {
        produit.setId(null); // sécurité : on laisse la base générer l'id
        return repository.save(produit);
    }

    // UPDATE : on récupère l'existant, on met à jour ses champs, on sauvegarde
    public Produit update(Long id, Produit data) {
        Produit existant = findById(id); // réutilise le 404 ci-dessus
        existant.setNom(data.getNom());
        existant.setPrix(data.getPrix());
        existant.setStock(data.getStock());
        existant.setCategorie(data.getCategorie());
        return repository.save(existant);
    }

    // DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Produit " + id + " introuvable");
        }
        repository.deleteById(id);
    }
}
```

> 🔑 **Injection de dépendance** : on ne fait jamais `new ProduitRepository()`. Spring crée les objets et les "injecte" via le constructeur. C'est le cœur du framework (IoC = Inversion of Control).
>
> 📌 **`ResponseStatusException(NOT_FOUND, ...)`** : si le produit n'existe pas, on renvoie un vrai code HTTP **404**, pas une erreur 500 moche.

---

## 🌐 ÉTAPE 5 — Le `Controller` REST (les endpoints)

Le Controller expose l'API : il fait le lien entre les **URLs HTTP** et le **Service**. Fichier `controller/ProduitController.java` :

```java
package com.formation.produits.controller;

import com.formation.produits.model.Produit;
import com.formation.produits.service.ProduitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController                  // = @Controller + @ResponseBody (renvoie du JSON)
@RequestMapping("/api/produits") // préfixe commun à toutes les URLs de cette classe
public class ProduitController {

    private final ProduitService service;

    public ProduitController(ProduitService service) {
        this.service = service;
    }

    // GET /api/produits  -> liste
    @GetMapping
    public List<Produit> findAll() {
        return service.findAll();
    }

    // GET /api/produits/3  -> un produit ({id} est capté par @PathVariable)
    @GetMapping("/{id}")
    public Produit findById(@PathVariable Long id) {
        return service.findById(id);
    }

    // POST /api/produits  -> créer (le JSON du body devient un Produit)
    // @Valid déclenche les contrôles @NotBlank / @Min de l'entité
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // renvoie 201 au lieu de 200
    public Produit create(@Valid @RequestBody Produit produit) {
        return service.create(produit);
    }

    // PUT /api/produits/3  -> modifier
    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @Valid @RequestBody Produit produit) {
        return service.update(id, produit);
    }

    // DELETE /api/produits/3  -> supprimer (204 = succès sans contenu)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
```

### Les annotations clés à retenir

| Annotation | Rôle |
|---|---|
| `@RestController` | La classe gère des requêtes REST et renvoie du **JSON** |
| `@RequestMapping("/api/produits")` | **Préfixe** d'URL commun à toutes les méthodes |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` | Associe une méthode Java à un **verbe HTTP** |
| `@PathVariable` | Récupère une valeur dans l'**URL** (`/produits/{id}`) |
| `@RequestBody` | Convertit le **JSON reçu** en objet Java |
| `@Valid` | Déclenche la **validation** (`@NotBlank`, `@Min`) |
| `@ResponseStatus` | Force le **code HTTP** renvoyé (201, 204...) |

---

## 🔓 ÉTAPE 6 — CORS (autoriser Angular à appeler l'API)

⚠️ **Point crucial !** Angular tourne sur `http://localhost:4200` et l'API sur `http://localhost:8080`. Ce sont **deux origines différentes** → par défaut, le navigateur **bloque** l'appel (sécurité **CORS** = *Cross-Origin Resource Sharing*).

Il faut **autoriser** explicitement l'origine d'Angular. Fichier `config/CorsConfig.java` :

```java
package com.formation.produits.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                  // sur toutes les URLs /api/...
                .allowedOrigins("http://localhost:4200") // autorise le front Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

> 🔑 **Sans cette config, Angular recevra une erreur CORS** dans la console du navigateur (et l'appel échouera) — c'est l'erreur n°1 des débutants. Retiens bien : **CORS se configure côté serveur** (Spring Boot), pas côté Angular.

---

## 🌱 ÉTAPE 7 — Données de départ (`data.sql`)

Pour avoir des produits dès le démarrage. Fichier `src/main/resources/data.sql` :

```sql
INSERT INTO produit (nom, prix, stock, categorie) VALUES ('Clavier mécanique', 79.90, 25, 'Informatique');
INSERT INTO produit (nom, prix, stock, categorie) VALUES ('Souris sans fil', 29.99, 60, 'Informatique');
INSERT INTO produit (nom, prix, stock, categorie) VALUES ('Casque audio', 119.00, 12, 'Audio');
INSERT INTO produit (nom, prix, stock, categorie) VALUES ('Café en grains 1kg', 14.50, 100, 'Alimentation');
INSERT INTO produit (nom, prix, stock, categorie) VALUES ('Carnet A5', 4.90, 200, 'Papeterie');
```

> 📌 Grâce à `spring.jpa.defer-datasource-initialization=true` (étape 1), ce script s'exécute **après** que Hibernate ait créé la table.

---

## ▶️ ÉTAPE 8 — Lancer et tester l'API

### Démarrer le serveur

```bash
cd produits-api
mvn spring-boot:run
```

> Au premier lancement, Maven télécharge les dépendances (patiente). Quand tu vois `Started ProduitsApiApplication`, c'est prêt ! 🎉

### Tester dans le navigateur (GET)

Ouvre **<http://localhost:8080/api/produits>** → tu dois voir le JSON des 5 produits.

### Voir la base de données (console H2)

Ouvre **<http://localhost:8080/h2-console>** :
- **JDBC URL** : `jdbc:h2:mem:produitsdb` (⚠️ exactement celle de `application.properties`)
- **User** : `sa`, **Password** : *(vide)*
- Clique **Connect** → tu peux faire `SELECT * FROM PRODUIT;`

### Tester tous les verbes avec `curl`

```bash
# GET tous
curl http://localhost:8080/api/produits

# GET un
curl http://localhost:8080/api/produits/1

# POST (créer) -> renvoie 201
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"Webcam HD","prix":49.90,"stock":30,"categorie":"Informatique"}'

# PUT (modifier) -> renvoie 200
curl -X PUT http://localhost:8080/api/produits/1 \
  -H "Content-Type: application/json" \
  -d '{"nom":"Clavier mécanique RGB","prix":89.90,"stock":20,"categorie":"Informatique"}'

# DELETE (supprimer) -> renvoie 204
curl -X DELETE http://localhost:8080/api/produits/5

# Test validation : nom vide -> renvoie 400 Bad Request
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"","prix":10,"stock":5,"categorie":"Test"}'
```

> 💡 Tu peux aussi utiliser **Postman** ou l'extension **REST Client** de VS Code pour tester plus confortablement.

---

## 🧠 Concepts du jour

- **API REST** : on expose des **ressources** (`/produits`) manipulées par les **verbes HTTP** (GET/POST/PUT/DELETE). Les données circulent en **JSON**.
- **Architecture en couches** : Controller (HTTP) → Service (métier) → Repository (données) → Entity (table). Chaque couche, une responsabilité.
- **Injection de dépendance** : Spring crée et fournit les objets (`@Service`, `@Repository`...) ; on ne fait jamais `new`.
- **Spring Data JPA** : un Repository qui hérite de `JpaRepository` obtient gratuitement le CRUD + des requêtes dérivées (`findByCategorie`).
- **Codes HTTP** : `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request` (validation), `404 Not Found`.
- **CORS** : à configurer **côté serveur** pour autoriser le front Angular (origine différente).

---

## 🧠 Quiz

1. Quelle couche reçoit la requête HTTP et renvoie le JSON ?
2. À quoi sert `@RequestBody` ? Et `@PathVariable` ?
3. Pourquoi un POST réussi renvoie-t-il `201` et pas `200` ?
4. Que se passe-t-il si on appelle Angular (`:4200`) → API (`:8080`) sans config CORS ?
5. Quelle annotation déclenche la validation `@NotBlank` / `@Min` ?
6. Quelles méthodes obtient-on **gratuitement** en héritant de `JpaRepository` ?

---

## 🚀 Pour aller plus loin

1. **Recherche** : ajoute `GET /api/produits?categorie=Audio` (utilise `findByCategorie` + un `@RequestParam`).
2. **DTO** : sépare l'entité (base) de l'objet exposé à l'API (bonne pratique pro).
3. **Gestion d'erreurs globale** : `@RestControllerAdvice` pour formater proprement les erreurs.
4. **Persistance fichier** : passe H2 en mode fichier (`jdbc:h2:file:./data/produitsdb`) pour garder les données.
5. **Swagger / OpenAPI** : ajoute `springdoc-openapi` pour une doc interactive de l'API sur `/swagger-ui.html`.

---

➡️ **API prête !** Laisse-la tourner sur `:8080`, puis passe au front : **`produits-app/README.md`** pour construire l'interface Angular qui consomme cette API.
