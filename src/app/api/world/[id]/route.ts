import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const baseUrl = 'https://vrchat-bridge.unstealable.cloud'
    const { id: worldId } = await params

    // Rechercher le monde par ID en utilisant l'endpoint de recherche
    const searchResponse = await fetch(`${baseUrl}/api/search/worlds/${worldId}?n=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!searchResponse.ok) {
      if (searchResponse.status === 404) {
        return NextResponse.json({ error: 'World not found' }, { status: 404 })
      }
      throw new Error(`HTTP error! status: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()

    // Vérifier si nous avons des résultats
    if (!searchData || (Array.isArray(searchData) && searchData.length === 0)) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 })
    }

    // Retourner le premier résultat (ou l'objet direct si ce n'est pas un array)
    const worldData = Array.isArray(searchData) ? searchData[0] : searchData

    return NextResponse.json(worldData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 408 }
        )
      }
      
      if (error.message.includes('HTTP error')) {
        return NextResponse.json(
          { error: 'External API error' },
          { status: 502 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}