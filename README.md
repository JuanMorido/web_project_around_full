# Mundínamo

## Qué hace el programa

Mundínamo es la suite para evaluar la viabilidad de un proyecto de generación de energía en cualquier lugar del mundo. Sirve para pasar de una idea de planta a una primera respuesta: qué tecnología, en qué país y a qué precio podría entregar la energía.

Está pensada para quien trabaja en generación y necesita plantear una solución con una tecnología que ya se comercialice. Se parte de lo que hoy se puede comprar, construir y operar.

La planta puede estar ya construida o todavía por diseñar. En la sección de tecnologías se miran las condiciones técnicas de esa solución y, al mismo tiempo, un estimado de costos. Ese estimado sigue el nivel de estimación económica que usted elija: una mirada de orden de magnitud no pide el mismo detalle que un estudio más avanzado.

Esa tecnología necesita un destino. El destino es un país, y puede ser cualquiera. De allí se recoge cómo es la red eléctrica nacional, qué dice la normativa y qué combustibles hay disponibles. Esos datos se cruzan con los indicadores económicos del caso para calcular el precio final por MWh de la tecnología planteada en el país seleccionado.

Una tecnología en un lugar es un proyecto. Usted puede crear varios. Con la misma tecnología en distintos países compara precios y posibilidades, y ve dónde esa planta tiene más sentido. También puede fijar un lugar y una demanda, y probar distintas soluciones hasta ver cuál encaja mejor.

Mundínamo quiere ampliar el acceso de cualquier persona al mundo de la energía. Está hecha para que usted explore sus ideas con orden y encuentre una salida en un mercado difícil, pero con una demanda alta.

Al elegir un país en el globo, el clima de 2024 llega de Open-Meteo. Si el país es Colombia, la demanda, la generación y el precio de bolsa del día llegan de XM.

El mismo texto está en la página [Sobre Mundínamo](https://juanmorido.github.io/web_project_around_full/sobre).

## Estructura

- `client/` — la página (React, Vite y TypeScript)
- `server/` — la API (Express y MongoDB)

## Tecnologías

- React 19, TypeScript, Vite y React Router
- Express 5, MongoDB, Mongoose, bcrypt y JWT
- Open-Meteo (clima) y XM (red eléctrica de Colombia)

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
