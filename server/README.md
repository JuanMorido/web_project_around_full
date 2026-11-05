# Mundínamo — API

La API propia. Guarda las cuentas y los proyectos de energía, y consulta la red de Colombia (XM) y la de Estados Unidos (PUDL).

## Qué hace

- Registro, ingreso y recuperación de contraseña. El ingreso es por usuario, no por correo.
- El perfil y los proyectos exigen token. Cada quien solo lee y borra lo suyo.
- `GET /sources/xm` y `GET /sources/pudl` son públicas. PUDL se lee en Parquet desde `s3://pudl.catalyst.coop/nightly/`, filtrando columnas y un día.

## Cómo ejecutarlo

```bash
cp .env.example .env
npm install
npm run dev
```

La API queda en http://localhost:3001. `GET /health` no pide base de datos ni token.

## Rutas

| Método | Ruta | Quién |
| --- | --- | --- |
| POST | `/signup` | Público |
| POST | `/signin` | Público |
| POST | `/recover` | Público, con el correo de recuperación |
| GET | `/users/me` | Con token |
| PATCH | `/users/me` | Con token |
| GET | `/projects` | Con token, solo los propios |
| POST | `/projects` | Con token |
| PATCH | `/projects/:id` | Con token, solo el dueño |
| DELETE | `/projects/:id` | Con token, solo el dueño |
