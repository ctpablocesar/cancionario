"use client"

import { Cassette } from "@/components/cassette"
import { TrackCover } from "@/components/track-cover"
import { Button } from "@/components/ui/button"
import type { Track } from "@/lib/api/tracks"
import { sideBreak } from "@/lib/mixtape"
import { Loader2, Music2, Pencil } from "lucide-react"

const SummaryScreen = ({
  questions,
  answers,
  name,
  onEdit,
  onSave,
  isPending,
  errorMessage,
}: {
  questions: string[]
  answers: Record<number, Track>
  name: string
  onEdit: (index: number) => void
  onSave: () => void
  isPending: boolean
  errorMessage: string | null
}) => {
  const answeredCount = questions.filter((_, index) => answers[index]).length
  const allAnswered = answeredCount === questions.length
  const split = sideBreak(questions.length)

  const sides = [
    { label: "Lado A", start: 0, end: split },
    { label: "Lado B", start: split, end: questions.length },
  ].filter((side) => side.start < side.end)

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Cassette
          title={name}
          left="cancionario"
          right="mixtape"
          progress={answeredCount / questions.length}
          className="w-36 shrink-0 sm:w-44"
        />
        <div>
          <h1 className="font-wide text-3xl leading-tight text-balance sm:text-4xl">
            Revisa tu mixtape
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Toca una canción para cambiarla antes de grabar.
          </p>
        </div>
      </header>

      {sides.map((side) => {
        const sideQuestions = questions.slice(side.start, side.end)
        const sideAnswered = sideQuestions.filter(
          (_, offset) => answers[side.start + offset]
        ).length

        return (
          <section
            key={side.label}
            className="mt-8 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6"
          >
            <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-2">
              <h2 className="font-wide text-sm">{side.label}</h2>
              <p className="text-xs text-ink/65 tabular-nums">
                {sideAnswered} de {sideQuestions.length}
              </p>
            </div>

            <ol start={side.start + 1} className="mt-1 divide-y divide-ink/10">
              {sideQuestions.map((question, offset) => {
                const index = side.start + offset
                const track = answers[index]
                const rowLabel = track
                  ? `${question}: ${track.name} de ${track.artist}. Cambiar`
                  : `${question}: sin responder. Cambiar`

                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => onEdit(index)}
                      aria-label={rowLabel}
                      className="group flex w-full items-center gap-3 rounded-md px-1 py-3 text-left transition-colors hover:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-cobalt/60 focus-visible:outline-none"
                    >
                      <span className="w-5 shrink-0 text-right text-sm text-ink/60 tabular-nums">
                        {index + 1}
                      </span>

                      {track ? (
                        <TrackCover track={track} size={44} />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-11 shrink-0 items-center justify-center rounded border border-dashed border-ink/25 text-ink/30"
                        >
                          <Music2 className="size-5" />
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs text-ink/65">
                          {question}
                        </span>
                        {track ? (
                          <>
                            <span className="block truncate font-hand text-xl leading-tight font-medium">
                              {track.name}
                            </span>
                            <span className="block truncate text-xs text-ink/65">
                              {track.artist}
                            </span>
                          </>
                        ) : (
                          <span className="block text-sm font-medium">
                            <span className="bg-amber/40 px-1">
                              Sin responder
                            </span>
                            <span className="text-ink/60">
                              {" "}
                              · Toca para elegir una canción
                            </span>
                          </span>
                        )}
                      </span>

                      <span className="flex shrink-0 items-center gap-1 text-xs text-ink/60 transition-colors group-hover:text-ink">
                        <Pencil className="size-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Cambiar</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm tabular-nums">
            {answeredCount} de {questions.length} canciones listas
          </p>
          <p className="text-sm text-muted-foreground">
            La playlist se crea en privado; el link sí se puede compartir.
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button
          size="lg"
          disabled={!allAnswered || isPending}
          onClick={onSave}
          className="h-12 w-full rounded-lg px-6 text-base sm:w-auto sm:self-start"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Grabando…
            </>
          ) : (
            "Grabar playlist"
          )}
        </Button>
      </div>
    </main>
  )
}

export default SummaryScreen
