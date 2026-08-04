import { getSpotifyAppToken } from "@/lib/spotify"
import { NextRequest, NextResponse } from "next/server"

interface SpotifyArtist {
  name: string
}

interface SpotifyImage {
  url: string
}

interface SpotifyTrackItem {
  uri: string
  name: string
  artists: SpotifyArtist[]
  album: {
    images: SpotifyImage[]
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    const token = await getSpotifyAppToken()

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!spotifyRes.ok) {
      const errorBody = await spotifyRes.text()
      console.error("Spotify search error:", spotifyRes.status, errorBody)
      return NextResponse.json(
        { error: "Error al buscar en Spotify" },
        { status: 502 }
      )
    }

    const data = await spotifyRes.json()
    const items: SpotifyTrackItem[] = data.tracks?.items ?? []

    const tracks = items.map((track) => ({
      uri: track.uri,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumImage: track.album.images[0]?.url ?? "",
    }))

    return NextResponse.json(tracks)
  } catch (err) {
    console.error("search-track error:", err)
    return NextResponse.json(
      { error: "Error interno al buscar canciones" },
      { status: 500 }
    )
  }
}
