import type { Metadata, Viewport } from "next"
import { Archivo, Caveat } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/providers/query-provider"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

export const metadata: Metadata = {
  title: "Cancionario · el mixtape de tus amigos",
  description:
    "Responde cada pregunta con una canción y al final todas se graban en una playlist de Spotify.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9ecf2" },
    { media: "(prefers-color-scheme: dark)", color: "#12162a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", archivo.variable, caveat.variable)}
    >
      <body>
        <Analytics />
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
