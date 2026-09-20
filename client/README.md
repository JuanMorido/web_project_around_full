# Around The U.S. — React

Galería interactiva de tarjetas de lugares, migrada a **React**. El perfil y las tarjetas llegan de la API de TripleTen. Las acciones (like, borrar, editar, crear) actualizan el estado de la aplicación.

## Funcionalidad

- Carga el usuario y las tarjetas con `Promise.all` al montar `App`
- Comparte `currentUser` y los handlers de perfil, avatar, nueva tarjeta y borrado con Context
- `Main` y `Card` se suscriben a `CurrentUserContext`
- Like de tarjetas y borrado solo de las propias (con confirmación `RemoveCard`)
- Formulario de perfil controlado (`useState`)
- Formulario de avatar no controlado (`useRef`)
- Nueva tarjeta controlada; la tarjeta creada aparece al inicio de la lista
- Ventana de imagen a tamaño completo

## Arquitectura

- `src/utils/api.ts` — instancia de `Api` con token y URL base
- `src/contexts/CurrentUserContext.tsx` — contexto del usuario actual
- `src/interfaces/` — `UserData`, `CardData`, `CurrentUserContextType`, `ModalData`
- `App` — cerebro: estado de usuario, tarjetas y popups; llamadas a la API
- `Main` — perfil dinámico y galería
- `Main/components/card` — like por props; borrar solo si la tarjeta es propia
- `Main/components/popup` — `Popup`, `EditProfile`, `EditAvatar`, `NewCard`, `ImagePopup`, `RemoveCard`

## Tecnologías

- React 19 (componentes funcionales, hooks, Context)
- TypeScript
- Vite
- CSS3 con metodología BEM

## Cómo ejecutar

```bash
npm install
npm run dev
npm run build
```
