import { NextRequest, NextResponse } from 'next/server'
import { globalCache } from '@/lib/cache'
import { logger } from '@/lib/logger'

// Interface removed as we now use direct endpoint

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: worldId } = await params
  
  try {
    const baseUrl = process.env.VRCHAT_BRIDGE_API_URL || 'https://vrchat-bridge.unstealable.cloud'

    logger.info(`World API request for ID: ${worldId}`)
    logger.debug('Request details', { worldId, baseUrl })

    // Check cache first
    const cacheKey = globalCache.generateKey('world', worldId)
    const cachedData = globalCache.get(cacheKey)
    
    if (cachedData) {
      logger.info(`Cache HIT for world: ${worldId}`, { 
        worldName: (cachedData as { name?: string }).name, 
        worldId: (cachedData as { id?: string }).id 
      })
      return NextResponse.json(cachedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
          'X-Cache': 'HIT',
        },
      })
    }

    logger.info(`Cache MISS for world: ${worldId}, fetching from VRChat Bridge API`)

    // ✅ FIXED: Using NEW direct world endpoint!
    const worldUrl = `${baseUrl}/api/worlds/${worldId}`
    logger.apiRequest('GET', worldUrl, { method: 'direct world lookup' })
    
    const worldResponse = await fetch(worldUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!worldResponse.ok) {
      if (worldResponse.status === 404) {
        logger.warn(`World not found: ${worldId}`)
        return NextResponse.json({ error: 'World not found' }, { status: 404 })
      }
      throw new Error(`HTTP error! status: ${worldResponse.status}`)
    }

    const worldData = await worldResponse.json()
    logger.apiResponse('GET', worldUrl, worldResponse.status, {
      worldId: worldData?.id,
      worldName: worldData?.name,
      hasData: !!worldData
    })

    logger.data('Direct API response', worldData)

    // Vérifier si nous avons des données
    if (!worldData) {
      logger.warn(`No world data returned for ID: ${worldId}`)
      return NextResponse.json({ error: 'World not found' }, { status: 404 })
    }

    // ✅ VERIFICATION: With direct endpoint, ID should always match
    if (worldData.id && worldData.id !== worldId) {
      logger.error(`UNEXPECTED ID MISMATCH with direct endpoint! Requested: ${worldId}, Got: ${worldData.id}`, {
        requestedId: worldId,
        returnedId: worldData.id,
        worldName: worldData.name,
        worldUrl
      })
    } else {
      logger.info(`Direct world lookup successful`, {
        requestedId: worldId,
        returnedId: worldData.id,
        worldName: worldData.name
      })
    }

    // Store in cache
    globalCache.set(cacheKey, worldData)
    logger.debug(`Cached world data for: ${worldId}`, { worldName: worldData.name })

    return NextResponse.json(worldData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
        'X-Cache': 'MISS',
      },
    })

  } catch (error) {
    logger.apiError('GET', `/api/world/${worldId}`, error)
    logger.error('World API Error details', { worldId, error: error instanceof Error ? error.message : error })
    
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