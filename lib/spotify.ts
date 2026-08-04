interface SpotifyTokenCache {
  accessToken: string | null
  expiresAt: number
}

declare global {
  var spotifyTokenCache: SpotifyTokenCache | undefined
}

const cache: SpotifyTokenCache = global.spotifyTokenCache ?? {
  accessToken: null,
  expiresAt: 0,
}

if (!global.spotifyTokenCache) {
  global.spotifyTokenCache = cache
}

export async function getSpotifyAppToken(): Promise<string> {
  if (cache.accessToken && Date.now() < cache.expiresAt - 60_000) {
    return cache.accessToken
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  })

  if (!res.ok) {
    throw new Error("No se pudo obtener el token de Spotify")
  }

  const data = await res.json()

  cache.accessToken = data.access_token
  cache.expiresAt = Date.now() + data.expires_in * 1000

  return cache.accessToken as string
}
