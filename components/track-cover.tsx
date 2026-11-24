import type { Track } from "@/lib/api/tracks"
import { cn } from "@/lib/utils"
import { Music2 } from "lucide-react"
import Image from "next/image"

export function TrackCover({
  track,
  size,
  className,
}: {
  track: Track
  size: number
  className?: string
}) {
  if (!track.albumImage) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded bg-ink/10 text-ink/40",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Music2 className="size-5" />
      </div>
    )
  }

  return (
    <Image
      src={track.albumImage}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded object-cover", className)}
    />
  )
}
