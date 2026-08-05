import { Button } from "@/components/ui/button"

const DoneScreen = ({ playlistUrl }: { playlistUrl: string }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">¡Listo! 🎵</h1>
      <p className="text-gray-500">Tu playlist ya está armada</p>
      <Button size="lg">
        <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
          Abrir en Spotify
        </a>
      </Button>
    </div>
  )
}

export default DoneScreen
