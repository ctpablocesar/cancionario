export interface Track {
  uri: string
  name: string
  artist: string
  albumImage: string
}

export async function searchTracks(query: string): Promise<Track[]> {
  const res = await fetch(`/api/search-track?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error("Error buscando canciones")
  return res.json()
}
