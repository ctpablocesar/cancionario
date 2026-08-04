"use client"
import { Button } from "@/components/ui/button"
import type { Track } from "@/lib/api/tracks"
import { Loader2, Pencil } from "lucide-react"
import Image from "next/image"

const SummaryScreen = ({
  questions,
  answers,
  onEdit,
  onSave,
  isSaving,
}: {
  questions: string[]
  answers: Record<number, Track>
  onEdit: (index: number) => void
  onSave: () => void
  isSaving: boolean
}) => {
  const allAnswered = questions.every((_, i) => answers[i])

  return (
    <div className="flex min-h-svh flex-col items-center p-6">
      <h1 className="mt-6 text-center text-2xl font-bold">
        Revisa tus respuestas
      </h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        Puedes editar cualquiera antes de guardar
      </p>

      <div className="mt-6 flex w-1/2 flex-col gap-3">
        {questions.map((question, index) => {
          const track = answers[index]

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex min-w-0 items-center gap-3">
                {track ? (
                  <Image
                    src={track.albumImage}
                    alt={track.name}
                    width={48}
                    height={48}
                    className="shrink-0 rounded"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs text-gray-500">{question}</p>
                  {track ? (
                    <>
                      <p className="truncate text-sm font-medium">
                        {track.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {track.artist}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-red-500">
                      Sin responder
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => onEdit(index)}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 w-1/2 pb-6">
        <Button
          className="w-full"
          disabled={!allAnswered || isSaving}
          onClick={onSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
        {!allAnswered && (
          <p className="mt-2 text-center text-xs text-red-500">
            Te falta responder {questions.length - Object.keys(answers).length}{" "}
            pregunta(s)
          </p>
        )}
      </div>
    </div>
  )
}

export default SummaryScreen
