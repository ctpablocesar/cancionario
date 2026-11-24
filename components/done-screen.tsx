import { Cassette } from "@/components/cassette"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

const DoneScreen = ({
  playlistUrl,
  name,
  trackCount,
}: {
  playlistUrl: string
  name: string
  trackCount: number
}) => {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-[460px]">
        <Cassette
          title={`Cancionario de ${name}`}
          left="playlist lista"
          right={`${trackCount} canciones`}
          progress={1}
        />
      </div>

      <h1 className="font-wide mt-10 text-4xl leading-tight text-balance">
        Playlist grabada
      </h1>
      <p className="mt-3 max-w-sm text-pretty text-muted-foreground">
        Ya puedes escucharla o compartir el link con quien quieras.
      </p>

      <a
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-8 h-12 rounded-lg px-6 text-base"
        )}
      >
        Abrir en Spotify
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </main>
  )
}

export default DoneScreen
