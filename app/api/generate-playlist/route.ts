import { NextRequest, NextResponse } from "next/server"

interface TrackInput {
  uri: string
}

async function getUserAccessToken(): Promise<string> {
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
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    console.error("Spotify refresh token error:", res.status, errorBody)
    throw new Error(`No se pudo refrescar el token: ${errorBody}`)
  }

  const data = await res.json()
  return data.access_token
}

async function createPlaylist(accessToken: string, name: string) {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description: "Generada desde el Cancionario",
      public: false,
    }),
  })

  if (!res.ok) throw new Error("No se pudo crear la playlist")
  return res.json()
}

async function addTracks(
  accessToken: string,
  playlistId: string,
  uris: string[]
) {
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100)
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: chunk }),
      }
    )
    if (!res.ok) {
      const errorBody = await res.text()
      console.error("Spotify add tracks error:", res.status, errorBody)
      throw new Error(`No se pudieron agregar canciones: ${errorBody}`)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, tracks } = (await req.json()) as {
      name: string
      tracks: TrackInput[]
    }

    if (!name || !tracks?.length) {
      return NextResponse.json(
        { error: "Falta el nombre o las canciones" },
        { status: 400 }
      )
    }

    const accessToken = await getUserAccessToken()
    const playlist = await createPlaylist(accessToken, name)

    const uris = tracks.map((t) => t.uri)
    await addTracks(accessToken, playlist.id, uris)

    return NextResponse.json({
      playlistUrl: playlist.external_urls.spotify,
      playlistId: playlist.id,
    })
  } catch (err) {
    console.error("generate-playlist error:", err)
    return NextResponse.json(
      { error: "Error al generar la playlist" },
      { status: 500 }
    )
  }
}
