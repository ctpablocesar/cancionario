import { searchTracks } from "@/lib/api/tracks"
import { useQuery } from "@tanstack/react-query"

export function useTrackSearch(query: string) {
  return useQuery({
    queryKey: ["track-search", query],
    queryFn: () => searchTracks(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60,
  })
}
