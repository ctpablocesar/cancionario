"use client"

import { Cassette } from "@/components/cassette"
import { TrackCover } from "@/components/track-cover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useTrackSearch } from "@/hooks/use-track-search"
import type { Track } from "@/lib/api/tracks"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

const QuestionScreen = ({
  question,
  index,
  total,
  side,
  selectedTrack,
  onSelectTrack,
  onClearTrack,
  onNext,
  onBack,
  isLastQuestion,
}: {
  question: string
  index: number
  total: number
  side: "A" | "B"
  selectedTrack: Track | null
  onSelectTrack: (track: Track) => void
  onClearTrack: () => void
  onNext: () => void
  onBack: () => void
  isLastQuestion: boolean
}) => {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [spinning, setSpinning] = useState(false)

  const debouncedQuery = useDebounce(query, 400)
  const {
    data: results = [],
    isLoading,
    isError,
  } = useTrackSearch(debouncedQuery)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const changeButtonRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])
  const spinTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasQuery = debouncedQuery.trim().length > 1
  const showList = open && hasQuery && !selectedTrack
  const progress = (index + (selectedTrack ? 1 : 0)) / total

  useEffect(() => {
    if (selectedTrack) return
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus()
    }
  }, [selectedTrack])

  useEffect(() => {
    if (!selectedTrack) return
    changeButtonRef.current?.focus()
  }, [selectedTrack])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  useEffect(() => {
    if (activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  useEffect(() => {
    return () => {
      if (spinTimeout.current) clearTimeout(spinTimeout.current)
    }
  }, [])

  const selectTrack = (track: Track) => {
    onSelectTrack(track)
    setQuery("")
    setOpen(false)
    setActiveIndex(-1)
    setSpinning(true)
    if (spinTimeout.current) clearTimeout(spinTimeout.current)
    spinTimeout.current = setTimeout(() => setSpinning(false), 1200)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!hasQuery || results.length === 0) return
      setOpen(true)
      setActiveIndex((current) => (current + 1) % results.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!hasQuery || results.length === 0) return
      setOpen(true)
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1
      )
      return
    }

    if (event.key === "Home" && showList) {
      event.preventDefault()
      setActiveIndex(0)
      return
    }

    if (event.key === "End" && showList) {
      event.preventDefault()
      setActiveIndex(results.length - 1)
      return
    }

    if (event.key === "Enter") {
      const track = activeIndex >= 0 ? results[activeIndex] : undefined
      if (showList && track) {
        event.preventDefault()
        selectTrack(track)
      }
      return
    }

    if (event.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedTrack) return
    onNext()
  }

  const statusMessage = isLoading
    ? "Buscando…"
    : isError
      ? "No se pudo buscar. Revisa tu conexión e intenta de nuevo."
      : results.length === 0
        ? "No encontramos esa canción. Prueba con el artista o el álbum."
        : null

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-6 py-8 sm:py-12">
      <header className="flex items-center gap-4">
        <Cassette
          title=""
          left=""
          right=""
          progress={progress}
          spinning={spinning}
          className="w-32 shrink-0 sm:w-44"
        />
        <div>
          <p className="text-sm font-medium">Lado {side}</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            Canción {index + 1} de {total}
          </p>
        </div>
      </header>

      <form className="mt-10 flex flex-col" onSubmit={handleSubmit} noValidate>
        <h1 className="font-wide max-w-[22ch] text-3xl leading-[1.1] text-balance sm:text-4xl">
          {question}
        </h1>

        <div className="mt-8 flex flex-col gap-2">
          <label htmlFor="track-search" className="text-sm font-medium">
            Tu respuesta
          </label>
          {selectedTrack ? (
            <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-label p-3 text-ink">
              <TrackCover track={selectedTrack} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-hand text-2xl leading-tight">
                  {selectedTrack.name}
                </p>
                <p className="truncate text-sm text-ink/65">
                  {selectedTrack.artist}
                </p>
              </div>
              <Button
                ref={changeButtonRef}
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearTrack}
                className="shrink-0 text-ink hover:bg-ink/10"
              >
                Cambiar
              </Button>
            </div>
          ) : (
            <div ref={containerRef} className="relative">
              <Input
                ref={inputRef}
                id="track-search"
                name="track-search"
                role="combobox"
                autoComplete="off"
                spellCheck={false}
                placeholder="Busca una canción…"
                value={query}
                aria-expanded={showList}
                aria-controls="track-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  showList && activeIndex >= 0
                    ? `track-option-${activeIndex}`
                    : undefined
                }
                onChange={(event) => {
                  setQuery(event.target.value)
                  setOpen(true)
                  setActiveIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                className="h-12 rounded-lg border-ink/20 bg-label px-4 text-base text-ink placeholder:text-ink/50 focus-visible:border-cobalt focus-visible:ring-3 focus-visible:ring-cobalt/25"
              />

              <div role="status" aria-live="polite" className="sr-only">
                {statusMessage}
              </div>

              {showList && (
                <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-ink/10 bg-label text-ink shadow-lg">
                  {statusMessage && (
                    <p
                      aria-hidden="true"
                      className="px-3 py-2 text-sm text-ink/65"
                    >
                      {statusMessage}
                    </p>
                  )}

                  {results.length > 0 && (
                    <ul
                      id="track-results"
                      role="listbox"
                      aria-label="Canciones encontradas"
                      className="max-h-72 overflow-y-auto overscroll-contain"
                    >
                      {results.map((track, optionIndex) => (
                        <li
                          key={track.uri}
                          id={`track-option-${optionIndex}`}
                          role="option"
                          aria-selected={optionIndex === activeIndex}
                          ref={(node) => {
                            optionRefs.current[optionIndex] = node
                          }}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectTrack(track)}
                          onMouseEnter={() => setActiveIndex(optionIndex)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 px-3 py-2",
                            optionIndex === activeIndex
                              ? "bg-amber/35"
                              : "hover:bg-ink/5"
                          )}
                        >
                          <TrackCover track={track} size={40} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {track.name}
                            </p>
                            <p className="truncate text-xs text-ink/65">
                              {track.artist}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {!selectedTrack && (
            <p className="text-sm text-muted-foreground">
              Busca por canción, artista o álbum.
            </p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="h-11 rounded-lg px-5"
          >
            Atrás
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!selectedTrack}
            className="h-11 rounded-lg px-6"
          >
            {isLastQuestion ? "Ver resumen" : "Siguiente"}
          </Button>
        </div>
      </form>
    </main>
  )
}

export default QuestionScreen
