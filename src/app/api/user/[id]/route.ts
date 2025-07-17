import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const baseUrl = 'https://vrchat-bridge.unstealable.cloud'
    const { id: userId } = await params

    // Récupérer le profil utilisateur principal
    const userResponse = await fetch(`${baseUrl}/api/users/${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      throw new Error(`HTTP error! status: ${userResponse.status}`)
    }

    const userData = await userResponse.json()

    // Récupérer les groupes de l'utilisateur
    let userGroups = []
    try {
      const groupsResponse = await fetch(`${baseUrl}/api/users/${userId}/groups`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      
      if (groupsResponse.ok) {
        userGroups = await groupsResponse.json()
      }
    } catch (error) {
      console.warn('Failed to fetch user groups:', error)
    }

    // Récupérer les mondes de l'utilisateur
    let userWorlds = []
    try {
      const worldsResponse = await fetch(`${baseUrl}/api/users/${userId}/worlds?n=10`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      
      if (worldsResponse.ok) {
        userWorlds = await worldsResponse.json()
      }
    } catch (error) {
      console.warn('Failed to fetch user worlds:', error)
    }

    // Enrichir les données utilisateur
    const enrichedUserData = {
      ...userData,
      groups: Array.isArray(userGroups) ? userGroups : [],
      publicWorlds: Array.isArray(userWorlds) ? userWorlds : [],
    }

    return NextResponse.json(enrichedUserData, {
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