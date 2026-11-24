# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio.

## Proyecto

**Cancionario**: formulario tipo Typeform donde cada respuesta es una canción de Spotify. Al final se crea una playlist en la cuenta de Spotify del dueño de la app. No hay login para quien contesta ni base de datos: las respuestas viven en el estado de React hasta que se envían.

La UI, los textos y los mensajes de error están en **español**. Mantén ese idioma en cualquier texto nuevo que vea el usuario.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- TanStack Query v5 para búsquedas y mutaciones
- Tailwind CSS v4 + shadcn/ui (estilo `base-rhea`, sobre `@base-ui/react`, no Radix)
- Iconos: `lucide-react`
- Spotify Web API
- Deploy en Vercel (`@vercel/analytics`)
- Gestor de paquetes: **pnpm** (no uses npm ni yarn)

## Comandos

```bash
pnpm install
pnpm dev         # servidor de desarrollo
pnpm build       # build de producción
pnpm lint        # ESLint (next core-web-vitals + typescript)
pnpm typecheck   # tsc --noEmit
pnpm format      # Prettier sobre **/*.{ts,tsx}
```

No hay tests. Antes de terminar un cambio, corre `pnpm lint` y `pnpm typecheck`.

## Estructura

```
app/
  page.tsx                     # Cliente. Define QUESTIONS y navega entre pantallas por número de paso
  layout.tsx                   # Fuentes, ThemeProvider, QueryProvider, Analytics
  api/search-track/route.ts    # GET ?q= → busca en Spotify (Client Credentials)
  api/generate-playlist/route.ts # POST {name, tracks} → crea la playlist (refresh token del dueño)
  callback/route.ts            # Callback de OAuth para sacar el refresh token (lógica comentada ahora mismo)
  get-token/page.tsx           # Página de apoyo para armar la URL de autorización
components/
  cassette.tsx                 # Cassette SVG con carretes; `progress` mueve la cinta y `spinning` la gira
  track-cover.tsx              # Portada del álbum con respaldo cuando falta la imagen
  start-screen.tsx, question-screen.tsx, summary-screen.tsx, done-screen.tsx
  ui/                          # Componentes generados por shadcn
hooks/                         # useDebounce, useTrackSearch, useGeneratePlaylist
lib/
  mixtape.ts                   # Reparte las preguntas entre Lado A y Lado B
  spotify.ts                   # Token de Client Credentials cacheado en `global`
  api/                         # Wrappers de fetch del lado del cliente hacia /api/*
  utils.ts                     # cn()
providers/query-provider.tsx   # QueryClient (staleTime 60s, retry 1)
```

## Diseño

La metáfora es un mixtape: la app se ve como la etiqueta de un cassette, y cada respuesta se "escribe" con letra a mano.

- Tokens en `app/globals.css`: `label` (fondo de tarjetas), `shell` (carcasa), `ink` (texto sobre etiqueta), `cobalt` (acción principal), `amber` (selección y marcatextos) y `tape` (cinta).
- En modo oscuro la página es azul marino, pero las etiquetas siguen claras: dentro de tarjetas usa siempre `bg-label text-ink`, no `text-foreground`.
- Tipografía: Archivo para todo (`font-wide` para encabezados) y Caveat para lo escrito a mano (`font-hand`).
- El cassette (`components/cassette.tsx`) es el indicador de progreso. La animación de los carretes se desactiva con `prefers-reduced-motion`.

## Flujo de datos

1. Componente → hook de React Query (`hooks/`) → wrapper de fetch (`lib/api/`) → route handler (`app/api/`) → Spotify.
2. La forma de un track compartida entre cliente y servidor es `Track` en `lib/api/tracks.ts`: `{ uri, name, artist, albumImage }`. Si la cambias, actualiza también el mapeo en `app/api/search-track/route.ts`.
3. Pasos en `app/page.tsx`: `1` = inicio, `2..N+1` = preguntas, `N+2` = resumen, `N+3` = listo. Los índices de pregunta se calculan como `step - 2`; ojo con desfases si tocas esto.

## Convenciones

- Prettier: sin punto y coma, comillas dobles, 2 espacios, `trailingComma: es5`, ancho 80, clases de Tailwind ordenadas por plugin (también dentro de `cn` y `cva`).
- Imports con el alias `@/` (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
- Archivos en kebab-case. Las pantallas se exportan por defecto; hooks y utilidades con export nombrado.
- Agrega `"use client"` solo a componentes que usan estado, efectos o hooks.
- Para componentes de UI nuevos usa la CLI de shadcn (`pnpm dlx shadcn@latest add <componente>`) en lugar de escribirlos a mano. No edites `components/ui/` sin una razón concreta.
- Usa `next/image` para portadas. Solo está permitido el host `i.scdn.co` (`next.config.ts`).
- Route handlers: envuelve todo en `try/catch`, registra errores con `console.error` y devuelve `NextResponse.json({ error: "..." }, { status })` con un mensaje en español.

## Spotify: detalles importantes

- Variables de entorno (`.env.local`, plantilla en `.env.template`): `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`. Son solo del servidor: nunca las expongas al cliente ni uses el prefijo `NEXT_PUBLIC_`.
- La búsqueda usa Client Credentials (`lib/spotify.ts`). La creación de la playlist usa el refresh token del dueño.
- Desde la migración de la API de 2026, la búsqueda devuelve **10 resultados como máximo** (`limit=10`).
- Para agregar canciones se usa `POST /playlists/{id}/items`, **no** `/tracks`. Se envían en bloques de 100.
- Las playlists se crean con `public: false`.
- El Redirect URI de OAuth es `http://127.0.0.1:3000/callback` (con `127.0.0.1`, no `localhost`).

## Cosas que conviene saber

- `mongoose` está en las dependencias pero no se usa en ningún lado.
- `app/callback/route.ts` tiene comentado el intercambio de código por token. Solo se necesita para generar el refresh token la primera vez.
- Las preguntas están en el arreglo `QUESTIONS` de `app/page.tsx`. El resto del flujo se adapta solo a la cantidad.
- Mientras se llena el formulario hay un aviso de `beforeunload`: no hay persistencia, así que cerrar la pestaña pierde las respuestas.
