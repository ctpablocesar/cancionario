import type { Track } from "@/lib/api/tracks"

export interface GeneratePlaylistResponse {
  playlistUrl: string
  playlistId: string
}

export async function generatePlaylist(
  name: string,
  tracks: Track[]
): Promise<GeneratePlaylistResponse> {
  const res = await fetch("/api/generate-playlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, tracks }),
  })
  if (!res.ok) throw new Error("No se pudo generar la playlist")
  return res.json()
}
