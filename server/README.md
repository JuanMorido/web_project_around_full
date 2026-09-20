# Around The U.S. — Express + MongoDB

Back end del proyecto **Around The U.S.** API REST con Node.js, Express y TypeScript. Los usuarios y las tarjetas se guardan en **MongoDB** mediante Mongoose.

## Funcionalidad

- Usuarios: listar, crear, obtener por id, perfil actual (`/users/me`), actualizar perfil y avatar
- Tarjetas: listar, crear, eliminar, like y dislike
- Cada tarjeta incluye `isLiked` según el usuario actual
- Autorización temporal con `req.user._id` (middleware)
- Errores centralizados: 400 (validación/casteo), 404 (no encontrado / ruta inexistente), 500 genérico

## Arquitectura

- `src/models/` — esquemas `User` y `Card`
- `src/controllers/` — lógica de negocio
- `src/routes/` — enrutamiento modular
- `src/middleware/error-handler.ts` — manejo de errores
- `src/types/express/` — tipado de `req.user`
- `src/app.ts` — conexión a MongoDB y montaje de middlewares

## Tecnologías

- Node.js + Express 5
- TypeScript + ES Modules
- MongoDB + Mongoose
- ESLint + Prettier + EditorConfig

## Cómo ejecutar

```bash
# MongoDB debe estar corriendo (mongod)
npm install
npm run dev      # hot reload en puerto 3000
npm run build
npm run start
npm run lint
```

Base de datos: `mongodb://127.0.0.1:27017/aroundb`

## Rutas principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Todos los usuarios |
| GET | `/users/me` | Usuario actual |
| GET | `/users/:id` | Usuario por id |
| POST | `/users` | Crear usuario |
| PATCH | `/users/me` | Actualizar perfil |
| PATCH | `/users/me/avatar` | Actualizar avatar |
| GET | `/cards` | Todas las tarjetas |
| POST | `/cards` | Crear tarjeta |
| DELETE | `/cards/:id` | Eliminar tarjeta |
| PUT | `/cards/:id/likes` | Dar like |
| DELETE | `/cards/:id/likes` | Quitar like |
