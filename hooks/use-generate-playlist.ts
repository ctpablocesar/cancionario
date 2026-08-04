import { generatePlaylist } from "@/lib/api/playlist"
import type { Track } from "@/lib/api/tracks"
import { useMutation } from "@tanstack/react-query"

export function useGeneratePlaylist() {
  return useMutation({
    mutationFn: ({ name, tracks }: { name: string; tracks: Track[] }) =>
      generatePlaylist(name, tracks),
  })
}
