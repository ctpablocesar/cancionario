"use client"

import { Cassette } from "@/components/cassette"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"

const StartScreen = ({
  name,
  onNameChange,
  onStart,
}: {
  name: string
  onNameChange: (value: string) => void
  onStart: () => void
}) => {
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setError("Escribe tu nombre para empezar.")
      inputRef.current?.focus()
      return
    }

    setError(null)
    onStart()
  }

  return (
    <main className="mx-auto grid min-h-svh w-full max-w-5xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div className="w-full max-w-[520px]">
        <Cassette
          title={name.trim() || "tu nombre"}
          left="cancionario"
          right="mixtape"
        />
      </div>

      <div>
        <h1 className="font-wide text-4xl leading-[1.05] text-balance sm:text-5xl">
          Llena el cancionario
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          Cada respuesta es una canción. Al final, todas se graban en una
          playlist de Spotify.
        </p>

        <form
          className="mt-8 flex max-w-md flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tu nombre
            </label>
            <Input
              ref={inputRef}
              id="name"
              name="name"
              autoComplete="off"
              spellCheck={false}
              placeholder="Escribe tu nombre…"
              value={name}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "name-error" : undefined}
              onChange={(event) => {
                onNameChange(event.target.value)
                if (error) setError(null)
              }}
              className="h-12 rounded-lg border-ink/20 bg-label px-4 text-base text-ink placeholder:text-ink/40 focus-visible:border-cobalt focus-visible:ring-3 focus-visible:ring-cobalt/25"
            />
            {error && (
              <p
                id="name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-lg px-6 text-base sm:w-auto sm:self-start"
          >
            Empezar a grabar
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Toma unos minutos y no necesitas cuenta de Spotify.
        </p>
      </div>
    </main>
  )
}

export default StartScreen
