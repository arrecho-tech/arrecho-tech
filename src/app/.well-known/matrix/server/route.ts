export const runtime = 'nodejs'

export async function GET() {
  return Response.json(
    {
      'm.server': 'matrix.arrecho.tech:443',
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
