"use client"
import DoneScreen from "@/components/done-screen"
import QuestionScreen from "@/components/question-screen"
import StartScreen from "@/components/start-screen"
import SummaryScreen from "@/components/summary-screen"
import { useGeneratePlaylist } from "@/hooks/use-generate-playlist"
import type { Track } from "@/lib/api/tracks"
import { useState } from "react"

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
  const [steps, setSteps] = useState(START_STEP)
  const [name, setName] = useState("")
  const [answers, setAnswers] = useState<Record<number, Track>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { mutate: generatePlaylist, isPending, data } = useGeneratePlaylist()

  const currentQuestionIndex = steps - FIRST_QUESTION_STEP
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1

  const handleStart = () => {
    if (!name.trim()) return
    setSteps(FIRST_QUESTION_STEP)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setSteps(SUMMARY_STEP)
    } else {
      setSteps((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (steps === FIRST_QUESTION_STEP) {
      setSteps(START_STEP)
    } else {
      setSteps((s) => s - 1)
    }
  }

  const handleEdit = (index: number) => {
    setSteps(index + FIRST_QUESTION_STEP)
  }

  const handleSave = () => {
    const tracks = Object.values(answers)
    generatePlaylist(
      { name: `Cancionario - ${name}`, tracks },
      { onSuccess: () => setSteps(DONE_STEP) }
    )
  }

  return (
    <>
      {steps === START_STEP && (
        <StartScreen name={name} onNameChange={setName} onStart={handleStart} />
      )}

      {steps >= FIRST_QUESTION_STEP && steps < SUMMARY_STEP && (
        <QuestionScreen
          steps={steps}
          questions={QUESTIONS}
          selectedTrack={answers[currentQuestionIndex] ?? null}
          onSelectTrack={(track) =>
            setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: track }))
          }
          onNext={handleNext}
          onBack={handleBack}
          isLastQuestion={isLastQuestion}
        />
      )}

      {steps === SUMMARY_STEP && (
        <SummaryScreen
          questions={QUESTIONS}
          answers={answers}
          onEdit={handleEdit}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {steps === DONE_STEP && data && (
        <DoneScreen playlistUrl={data.playlistUrl} />
      )}
    </>
  )
}
