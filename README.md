# 🎵 Cancionario

Un formulario tipo Typeform donde, en vez de responder con texto, respondes con canciones. Al final, todas las respuestas se convierten automáticamente en una playlist de Spotify.

Ejemplo de pregunta: *"Tu canción de amor favorita"* → buscas la canción, la seleccionas, y queda guardada como tu respuesta.

Pensado para usarse entre amigos y conocidos: cada quien contesta sin necesidad de tener cuenta de Spotify ni loguearse en ningún lado, y al final el dueño del proyecto genera la playlist en su propia cuenta.

## ✨ Cómo funciona

1. La persona entra al formulario y escribe su nombre.
2. Contesta una pregunta por pantalla, buscando y seleccionando una canción como respuesta.
3. Al terminar, ve un resumen con todas sus respuestas y puede editar cualquiera antes de confirmar.
4. Al dar "Guardar", el proyecto crea una playlist nueva en la cuenta de Spotify del dueño de la app y agrega todas las canciones seleccionadas.
5. Se muestra el link final para abrir la playlist en Spotify.

No hay base de datos: las respuestas viven únicamente en el estado del navegador durante el llenado del formulario, y se envían todas juntas al generar la playlist.

## 🛠️ Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [TanStack Query](https://tanstack.com/query) para las búsquedas y la generación de la playlist
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) (Client Credentials para buscar canciones, Authorization Code para crear la playlist)

## 📋 Requisitos previos

- Node.js 18 o superior
- [pnpm](https://pnpm.io/)
- Una cuenta de **Spotify Premium** (requisito de Spotify para registrar apps de desarrollador desde febrero de 2026)

## 🚀 Instalación

```bash
git clone https://github.com/ctpablocesar/cancionario.git
cd cancionario
pnpm install
```

## 🔑 Configuración de Spotify

### 1. Crea una app en el Dashboard de Spotify

1. Entra a [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) con tu cuenta Premium.
2. Click en **Create app**.
3. Llena el formulario:
   - **App name / Description:** lo que quieras
   - **Redirect URI:** `http://127.0.0.1:3000/callback` (debe ser exacto, y usa `127.0.0.1`, no `localhost`)
   - **APIs que planeas usar:** marca **Web API**
4. Guarda. Ya creada, entra a **Settings** y copia el **Client ID** y el **Client Secret** (este último está oculto, dale click al ícono de ojo para verlo).

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
SPOTIFY_REFRESH_TOKEN=
```

Deja `SPOTIFY_REFRESH_TOKEN` vacío por ahora, lo llenas en el siguiente paso.

### 3. Genera tu refresh token

El refresh token le da permiso a la app de crear playlists en **tu** cuenta de Spotify. Se genera una sola vez.

1. Levanta el proyecto en local:
   ```bash
   pnpm dev
   ```
2. Abre esta URL en tu navegador, reemplazando `TU_CLIENT_ID`:
   ```
   https://accounts.spotify.com/authorize?client_id=TU_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=playlist-modify-public+playlist-modify-private
   ```
3. Autoriza con tu cuenta Premium.
4. Spotify te redirige a `/callback`, que muestra en pantalla:
   ```
   SPOTIFY_REFRESH_TOKEN=AQD...
   ```
5. Copia ese valor completo a tu `.env.local`.
6. Reinicia el servidor (`Ctrl+C` y `pnpm dev` de nuevo) para que tome la variable nueva.

> ⚠️ El refresh token da acceso a modificar tus playlists. No lo compartas ni lo subas a git — `.env.local` ya está en `.gitignore` por defecto.

## ▶️ Correr el proyecto

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## ✏️ Personalizar las preguntas

Las preguntas están definidas directamente en `app/page.tsx`, en el arreglo `QUESTIONS`. Edítalo con las preguntas que quieras usar — el resto del flujo (progreso, edición, resumen) se ajusta automáticamente a la cantidad de preguntas.

## 📁 Estructura del proyecto

```
app/
  api/
    generate-playlist/   # Crea la playlist y agrega las canciones (usa tu refresh token)
    search-track/        # Busca canciones en el catálogo de Spotify (Client Credentials)
  callback/               # Recibe el code de OAuth y lo intercambia por el refresh token
  get-token/              # Página de apoyo para iniciar el flujo de autorización
  page.tsx                # Orquesta la navegación entre pantallas
components/
  start-screen.tsx        # Pantalla de nombre
  question-screen.tsx      # Pantalla de pregunta + búsqueda de canción
  summary-screen.tsx       # Resumen editable antes de guardar
  done-screen.tsx          # Pantalla final con el link a la playlist
hooks/                     # Hooks de React Query (búsqueda, generar playlist, debounce)
lib/
  spotify.ts               # Manejo del token de Client Credentials
  api/                      # Wrappers de fetch al backend propio
```

## ⚠️ Cosas a tener en cuenta

- **Límite de búsqueda:** Spotify limita los resultados de búsqueda a un máximo de 10 por consulta desde su migración de API de 2026.
- **Endpoint de playlists:** el proyecto usa `/playlists/{id}/items` (no `/tracks`), que es el endpoint vigente tras la misma migración.
- **Playlist privada, no oculta:** las playlists se crean con `public: false`, lo cual las oculta de tu perfil y búsquedas, pero cualquiera con el link igual puede abrirlas.
- **Sin persistencia:** si alguien cierra el navegador a medio formulario, pierde el progreso — no hay guardado automático en base de datos.

## 🌐 Deploy

El proyecto está pensado para deployarse en [Vercel](https://vercel.com). Recuerda configurar las mismas variables de entorno (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`) en **Settings → Environment Variables** del proyecto en Vercel — el `.env.local` no se sube al repositorio ni al deploy.