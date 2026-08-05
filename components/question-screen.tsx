"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { useDebounce } from "@/hooks/use-debounce"
import { useTrackSearch } from "@/hooks/use-track-search"
import type { Track } from "@/lib/api/tracks"
import Image from "next/image"
import { useState } from "react"

const QuestionScreen = ({
  steps,
  questions,
  onSelectTrack,
  selectedTrack,
  onNext,
  onBack,
  isLastQuestion,
}: {
  steps: number
  questions: string[]
  onSelectTrack: (track: Track) => void
  selectedTrack: Track | null
  onNext: () => void
  onBack: () => void
  isLastQuestion: boolean
}) => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 400)

  const { data: results, isLoading, isError } = useTrackSearch(debouncedQuery)

  const handleSelect = (track: Track) => {
    onSelectTrack(track)
    setQuery("")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full md:w-1/2">
        <Progress
          value={((steps - 1) / questions.length) * 100}
          className="w-full"
        >
          <ProgressLabel>
            Pregunta {steps - 1}/{questions.length}
          </ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 rounded-lg border border-gray-300 bg-white p-4 pt-6 shadow-md md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <Field>
          <FieldLabel htmlFor={`answer-${steps - 2}`}>
            <h2 className="text-lg font-semibold">{questions[steps - 2]}</h2>
          </FieldLabel>

          {selectedTrack ? (
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-2 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedTrack.albumImage}
                  alt={selectedTrack.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <p className="text-sm font-medium">{selectedTrack.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedTrack.artist}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTrack(null as unknown as Track)}
              >
                Cambiar
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Input
                autoFocus
                id={`answer-${steps - 2}`}
                autoComplete="off"
                placeholder="Buscar canción..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {debouncedQuery.trim().length > 1 && (
                <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {isLoading && (
                    <p className="p-3 text-sm text-gray-500">Buscando...</p>
                  )}
                  {isError && (
                    <p className="p-3 text-sm text-red-500">
                      Error al buscar, intenta de nuevo
                    </p>
                  )}
                  {results?.length === 0 && !isLoading && (
                    <p className="p-3 text-sm text-gray-500">Sin resultados</p>
                  )}
                  {results?.map((track) => (
                    <button
                      key={track.uri}
                      onClick={() => handleSelect(track)}
                      className="flex w-full items-center gap-3 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Image
                        src={track.albumImage}
                        alt={track.name}
                        width={36}
                        height={36}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{track.name}</p>
                        <p className="text-xs text-gray-500">{track.artist}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Field>
      </div>

      <div className="flex w-full items-center justify-between py-4 md:w-1/2">
        <Button className="h-10" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button className="h-10" disabled={!selectedTrack} onClick={onNext}>
          {isLastQuestion ? "Ver resumen" : "Siguiente"}
        </Button>
      </div>
    </div>
  )
}

export default QuestionScreen
