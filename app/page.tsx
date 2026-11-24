"use client"

import DoneScreen from "@/components/done-screen"
import QuestionScreen from "@/components/question-screen"
import StartScreen from "@/components/start-screen"
import SummaryScreen from "@/components/summary-screen"
import { useGeneratePlaylist } from "@/hooks/use-generate-playlist"
import type { Track } from "@/lib/api/tracks"
import { sideFor } from "@/lib/mixtape"
import { useEffect, useState } from "react"

const QUESTIONS: string[] = [
  "Tu canción de amor favorita",
  "La canción que te recuerda tu infancia",
  "La canción que escuchas cuando estás triste",
  "La que no puede faltar en una peda",
  "Tu gusto culposo",
  "La canción que sientes que te define",
  "Un artista o canción que nadie esperaría que te gusta",
  "La canción que cantarías en un karaoke sin dudarlo",
  "La canción más vieja que sigues escuchando",
  "Una canción que odiabas y ahora te encanta",
  "Canción que te recuerda a mí",
]

const START_STEP = 1
const FIRST_QUESTION_STEP = 2
const SUMMARY_STEP = QUESTIONS.length + 2
const DONE_STEP = QUESTIONS.length + 3

export default function Page() {
  const [step, setStep] = useState(START_STEP)
  const [name, setName] = useState("")
  const [answers, setAnswers] = useState<Record<number, Track>>({})
  const { mutate, isPending, data, error, reset } = useGeneratePlaylist()

  const currentQuestionIndex = step - FIRST_QUESTION_STEP
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1
  const answeredCount = Object.keys(answers).length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  useEffect(() => {
    const isFilling = step >= FIRST_QUESTION_STEP && step < DONE_STEP
    if (!isFilling) return

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [step])

  const handleStart = () => {
    if (!name.trim()) return
    setStep(FIRST_QUESTION_STEP)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setStep(SUMMARY_STEP)
    } else {
      setStep((current) => current + 1)
    }
  }

  const handleBack = () => {
    if (step === FIRST_QUESTION_STEP) {
      setStep(START_STEP)
    } else {
      setStep((current) => current - 1)
    }
  }

  const handleEdit = (index: number) => {
    setStep(index + FIRST_QUESTION_STEP)
  }

  const handleClearAnswer = (index: number) => {
    setAnswers((previous) => {
      const next = { ...previous }
      delete next[index]
      return next
    })
  }

  const handleSave = () => {
    if (isPending) return
    if (error) reset()

    mutate({
      name: `Cancionario de ${name.trim()}`,
      tracks: Object.values(answers),
    })
  }

  return (
    <>
      {step === START_STEP && (
        <StartScreen name={name} onNameChange={setName} onStart={handleStart} />
      )}

      {step >= FIRST_QUESTION_STEP && step < SUMMARY_STEP && (
        <QuestionScreen
          key={currentQuestionIndex}
          question={QUESTIONS[currentQuestionIndex]}
          index={currentQuestionIndex}
          total={QUESTIONS.length}
          side={sideFor(currentQuestionIndex, QUESTIONS.length)}
          selectedTrack={answers[currentQuestionIndex] ?? null}
          onSelectTrack={(track) =>
            setAnswers((previous) => ({
              ...previous,
              [currentQuestionIndex]: track,
            }))
          }
          onClearTrack={() => handleClearAnswer(currentQuestionIndex)}
          onNext={handleNext}
          onBack={handleBack}
          isLastQuestion={isLastQuestion}
        />
      )}

      {step === SUMMARY_STEP && (
        <SummaryScreen
          questions={QUESTIONS}
          answers={answers}
          name={name.trim()}
          onEdit={handleEdit}
          onSave={handleSave}
          isPending={isPending}
          errorMessage={
            error
              ? "No se pudo grabar la playlist. Revisa tu conexión e intenta de nuevo."
              : null
          }
        />
      )}

      {step === DONE_STEP && data && (
        <DoneScreen
          playlistUrl={data.playlistUrl}
          name={name.trim()}
          trackCount={answeredCount}
        />
      )}
    </>
  )
}
