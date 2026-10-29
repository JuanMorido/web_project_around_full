# Mundínamo

## Qué hace el programa

Pendiente. Este texto se escribe más adelante.

## Estructura

- `client/` — la página (React, Vite y TypeScript)
- `server/` — la API (Express y MongoDB)

## Tecnologías

- React 19, TypeScript, Vite y React Router
- Express 5, MongoDB, Mongoose, bcrypt y JWT

## Cómo ejecutarlo

1. MongoDB en marcha.
2. Copia las variables de entorno:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Desde la raíz:

```bash
npm run install:all
```

4. En dos terminales:

```bash
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:3000
```

La primera terminal es la API, la que guarda el registro. La segunda es la página.

## Repositorio

https://github.com/JuanMorido/web_project_around_full

Página publicada: https://juanmorido.github.io/web_project_around_full/

La entrega de la Etapa 1 va en la rama `stage-frontend`, con un pull request hacia `main`.
