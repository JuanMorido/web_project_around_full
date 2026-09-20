# Around The U.S. — full stack

Galería interactiva de lugares de Estados Unidos. El front end de React y la API de Express viven en el mismo repositorio: las tarjetas y el perfil salen de tu base de datos; el registro y el inicio de sesión usan la API de autenticación de TripleTen.

## Estructura

- `client/` — React (Vite + TypeScript)
- `server/` — Express + MongoDB

## Funcionalidad

- Registro e inicio de sesión con email y contraseña
- Token JWT en `localStorage` y restauración de sesión al recargar
- Ruta `/` protegida; visitantes van a `/signin`
- Cabecera distinta para visitante (enlace de registro o inicio de sesión) y usuario autenticado (email y cerrar sesión)
- Perfil, avatar, tarjetas, likes y borrado a través de la API propia en `http://localhost:3001`
- `CurrentUserContext` para el usuario actual y los manejadores de perfil, avatar, nueva tarjeta y borrado
- Ventana `InfoTooltip` para el resultado del registro y los errores de autenticación

## Tecnologías

- React 19, TypeScript, Vite, React Router
- Context API y componentes funcionales con hooks
- Express 5, MongoDB, Mongoose
- CSS3 con metodología BEM
- CORS para conectar el front en el puerto 3000 con la API en el 3001

## Cómo ejecutar

1. MongoDB en marcha (`aroundb`).
2. Desde la raíz:

```bash
npm run install:all
```

3. En dos terminales:

```bash
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:3000
```
