# tecnical-posts

Prueba técnica para el puesto de React developer. SPA en React + TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com):

1. Lista de usuarios con búsqueda por nombre.
2. Al elegir un usuario: sus publicaciones y un formulario para crear una nueva (título y texto obligatorios).
3. Estados de carga y error visibles en ambas vistas.
4. Suite de tests con Vitest + React Testing Library.

La API de JSONPlaceholder no persiste datos: las altas viven solo en el estado local y aparecen en la lista al instante.

Cómo ejecutarlo

Requisitos: Node.js 20+ y npm.

Comandos:
npm install
npm run dev

La app queda en `http://localhost:5173`.

### Otros comandos

| Comando | Qué hace |
|---------|----------|
| `npm test` | Corre la suite una vez (Vitest) |
| `npm run test:watch` | Vitest en watch |
| `npm run typecheck` | Chequeo de tipos (`tsc -b`) |
| `npm run lint` | Lint con oxlint |

Tests

npm test

Hay 11 tests en 3 archivos:

- `src/api/client.test.ts` — capa HTTP (éxito, error, endpoints).
- `src/pages/UsersPage.test.tsx` — carga de la lista, búsqueda por nombre, error + reintento.
- `src/pages/UserDetailPage.test.tsx` — posts del usuario, validación del formulario, alta en la lista, error de carga.

Decisiones

Stack mínimo a propósito: Vite + React 19 + TypeScript, fetch nativo (sin axios), CSS a mano (sin Tailwind), estado local con hooks (sin Zustand/Redux).

Arquitectura por capas:

src/api/        tipos y HTTP (sin React)
src/features/   lógica de flujo: hooks y funciones puras
src/components/ presentacionales (no hacen fetch)
src/pages/      containers que orquestan features + components
src/test/       setup de Testing Library


- `api/` no conoce React; `components/` no llama a la red; `pages/` coordina.
- Filtrado y validación son funciones puras (`filterUsers`, `validatePostForm`), fáciles de testear sin DOM.
- El alta de posts usa un hook (`usePosts.addPost`) que prependea al estado; no hay POST a la API porque no persistiría.

Iconos: Material Symbols de Google vía font link, sin emojis en la UI.

Navegación: estado simple en `App` (`selectedUser`). Sin router: para este alcance un `useState` es suficiente y evita una dependencia.

Tests: mocks del módulo `api/` (no de `fetch` a nivel global en los tests de UI) y queries por rol/label accesible (`getByRole`, `getByLabelText`) para que sean menos frágiles.

Warnings de lint: oxlint avisa `set-state-in-effect` en los hooks de carga. Es el patrón estándar de React para fetch al montar; se puede migrar a TanStack Query o un servidor React si el alcance crece.


Qué haría con más tiempo

- Zustand (o Context + useReducer): sacar `selectedUser` y el estado de posts del árbol de `App` a un store, si la app crece en vistas.
- Tailwind CSS: escalar estilos de forma consistente y evitar CSS global que hoy vive en `App.css`.
- Mejora de arquitectura: routing real (React Router), capa de data fetching con TanStack Query (cache, reintentos, dedupe), tests de integración de flujos completos, accesibilidad más allá de labels (focus management al navegar, `aria-live` en resultados de búsqueda).
- Otros: paginación de posts, debounce en la búsqueda, CI (GitHub Actions con typecheck + tests), e2e con Playwright, i18n.

Cómo usé la IA

Herramienta: asistente de código (OpenCode / Claude). Las decisiones de producto y de arquitectura fueron mías; la IA quedó como herramienta de ejecución para lo repetitivo.

Qué decidí yo

- Stack: Vite + React + TypeScript, fetch nativo, CSS a mano, hooks locales — sin axios, Tailwind ni Zustand en el MVP.
- Arquitectura por capas (`api / features / components / pages`) y qué vive en cada una.
- Alcance por fases, reglas de proceso (commits incrementales, aprobación previa, review por fase, sin emojis, Material Symbols, comentarios con voz humana, sin atribución de IA en el código).
- Dejar explícito en el README que, con más tiempo, se agregaría Zustand, Tailwind y una mejora de arquitectura.

Para qué usé la IA

- Ejecutar lo repetitivo: scaffold, boilerplate de componentes, estilos base y wiring de la capa `api/`.
- Redactar los tests (Vitest + Testing Library) a partir de los flujos que yo definí.
- Tareas mecánicas: installs, typecheck/lint en cada fase, commits con mensajes conventional cuando yo los aprobaba.

Qué corregí / ajusté yo

- Que no metiera librerías de más “porque sí”: Tailwind y Zustand quedan fuera del MVP y documentados en “qué haría con más tiempo”.
- Reglas de proceso que la IA no asumió sola: aprobación previa de cada commit, review por fase, cero atribución de IA en el código.
- Correcciones durante la implementación (por ejemplo, un import sin usar que rompía `typecheck`) tras ver los resultados de las herramientas.

Estructura

src/
  api/           client.ts, users.ts, posts.ts, types.ts
  features/
    users/       useUsers.ts, filterUsers.ts
    posts/       usePosts.ts, validatePostForm.ts
  components/    SearchInput, UserList, PostForm, PostList, LoadingState, ErrorState
  pages/         UsersPage, UserDetailPage (+ tests)
  test/          setup.ts de Testing Library
