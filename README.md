# Around The U.S. — full stack

Galería interactiva de lugares de Estados Unidos. El front end de React y la API de Express viven en el mismo repositorio: registro, inicio de sesión, perfil y tarjetas pasan por tu propio servidor.

## Estructura

- `client/` — React (Vite + TypeScript)
- `server/` — Express + MongoDB

## Funcionalidad

- Registro e inicio de sesión en la API propia (`POST /signup` y `POST /signin`)
- Contraseñas hasheadas con bcrypt y token JWT de 7 días
- Token en `localStorage`; al recargar, la sesión se restaura con `GET /users/me`
- Ruta `/` protegida; visitantes van a `/signin`
- Cabecera con el correo del perfil y cierre de sesión
- Cada cuenta solo ve, borra y da like a sus propias tarjetas
- Perfil, avatar y tarjetas a través de la API propia
- `CurrentUserContext` para el usuario actual y los manejadores de perfil, avatar, nueva tarjeta y borrado
- Ventana `InfoTooltip` para el resultado del registro y los errores de autenticación
- Limitadores de peticiones en registro e inicio de sesión

## Tecnologías

- React 19, TypeScript, Vite, React Router
- Context API y componentes funcionales con hooks
- Express 5, MongoDB, Mongoose, bcrypt, jsonwebtoken, express-rate-limit
- CSS3 con metodología BEM
- CORS para conectar el front con la API

## Cómo ejecutar

1. MongoDB en marcha (`aroundb`).
2. Copia las variables de entorno:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

En `server/.env` genera un `JWT_SECRET` propio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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

## Despliegue

- Front end: https://web-project-around-full-client.vercel.app
- API: https://web-project-around-full.vercel.app
- Estado de la API: https://web-project-around-full.vercel.app/health
