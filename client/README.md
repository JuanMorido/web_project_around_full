# Mundínamo — página

La pantalla del programa. El globo, el clima, la red del país y los proyectos de quien inició sesión.

## Qué hace

- Ingreso con usuario y contraseña. El correo solo recupera la clave.
- La cuenta de revisión entra con `admin` y `0000`.
- Cada persona ve y guarda solo sus proyectos.
- Al elegir un país, el clima llega de Open-Meteo. Colombia usa XM y Estados Unidos usa PUDL, a través de la API propia.

## Cómo ejecutarlo

Desde la raíz del repositorio, con la API ya en marcha:

```bash
cp .env.example .env
npm install
npm run dev
```

La página queda en http://localhost:3000. `VITE_API_URL` apunta a la API.
