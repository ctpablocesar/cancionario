export default function Page() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
  const REDIRECT_URI = "http://127.0.0.1:3000/callback"

  function getAuthUrl() {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: "playlist-modify-public playlist-modify-private",
    })
    console.log(`https://accounts.spotify.com/authorize?${params}`)
  }

  getAuthUrl()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">Obtener refresh token</h1>
      <p className="text-gray-500">
        Abre la consola para ver la URL de autorización y el refresh token
      </p>
    </div>
  )
}
