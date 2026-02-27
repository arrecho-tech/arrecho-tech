export const runtime = 'nodejs'

export async function GET() {
  return Response.json(
    {
      'm.homeserver': {
        base_url: 'https://matrix.arrecho.tech',
      },
    },
    {
      headers: {
        // Avoid surprises in clients
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
