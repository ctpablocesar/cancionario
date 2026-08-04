// app/callback/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Callback received" })

  // const code = req.nextUrl.searchParams.get("code")
  // const error = req.nextUrl.searchParams.get("error")

  // console.log("=== CALLBACK DEBUG ===")
  // console.log("code recibido:", code)

  // if (error) {
  //   return NextResponse.json({ error }, { status: 400 })
  // }

  // if (!code) {
  //   return NextResponse.json(
  //     { error: "No se recibió el código" },
  //     { status: 400 }
  //   )
  // }

  // const body = new URLSearchParams({
  //   grant_type: "authorization_code",
  //   code,
  //   redirect_uri: "http://127.0.0.1:3000/callback",
  // })

  // const res = await fetch("https://accounts.spotify.com/api/token", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     Authorization:
  //       "Basic " +
  //       Buffer.from(
  //         `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  //       ).toString("base64"),
  //   },
  //   body,
  // })

  // const data = await res.json()
  // console.log("Status:", res.status)
  // console.log("Respuesta de Spotify:", JSON.stringify(data, null, 2))

  // if (!res.ok) {
  //   return NextResponse.json({ error: data }, { status: 500 })
  // }

  // return new NextResponse(
  //   `<html><body style="font-family: monospace; padding: 20px;">
  //     <h2>Copia esto a tu .env.local:</h2>
  //     <pre>SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
  //   </body></html>`,
  //   { headers: { "Content-Type": "text/html" } }
  // )
}
