# digidex-api (TP6 P1)

Serveur GraphQL Apollo qui expose des queries Digimon.

## Endpoints GraphQL
- `digimons(page, pageSize, name)`
- `digimon(id)`
- `digimonByName(name)`

## Fichiers
- `src/schema.js` : schema GraphQL.
- `src/resolvers.js` : logique de resolution.
- `src/datasource.js` : appels REST vers `digi-api.com`.
- `src/index.js` : bootstrap serveur Apollo.

## Lancer
```bash
npm install
npm start
```

Serveur disponible sur `http://localhost:4000`.
