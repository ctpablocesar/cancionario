import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const StartScreen = ({
  name,
  onNameChange,
  onStart,
}: {
  name: string
  onNameChange: (value: string) => void
  onStart: () => void
}) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center">
        <Image src="/logo.png" alt="Logo" width={200} height={200} />
        <h1 className="text-center text-3xl font-bold">
          Bienvenido al cancionario
        </h1>
      </div>
      <div className="mt-6 flex w-1/2 flex-col gap-3 rounded-lg border border-gray-300 bg-white p-4 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <Field>
          <FieldLabel htmlFor="name">Tu nombre</FieldLabel>
          <Input
            id="name"
            autoComplete="off"
            placeholder="Escribe tu nombre aquí"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onStart()
            }}
          />
        </Field>
        <Button className="w-full" disabled={!name.trim()} onClick={onStart}>
          Comenzar
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
