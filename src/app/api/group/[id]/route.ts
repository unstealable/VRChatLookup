import { NextRequest, NextResponse } from 'next/server'
import { globalCache } from '@/lib/cache'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const baseUrl = process.env.VRCHAT_BRIDGE_API_URL || 'https://vrchat-bridge.unstealable.cloud'
    const { id: groupId } = await params

    // Check cache first
    const cacheKey = globalCache.generateKey('group', groupId)
    const cachedData = globalCache.get(cacheKey)
    
    if (cachedData) {
      logger.info(`Cache hit for group: ${groupId}`)
      return NextResponse.json(cachedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
          'X-Cache': 'HIT',
        },
      })
    }

    logger.info(`Cache miss for group: ${groupId}, fetching from API`)
    
    const groupUrl = `${baseUrl}/api/groups/${groupId}`
    logger.apiRequest('GET', groupUrl, { purpose: 'group lookup' })

    // Récupérer le groupe par ID
    const groupResponse = await fetch(`${baseUrl}/api/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!groupResponse.ok) {
      if (groupResponse.status === 404) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 })
      }
      throw new Error(`HTTP error! status: ${groupResponse.status}`)
    }

    const groupData = await groupResponse.json()
    
    logger.apiResponse('GET', groupUrl, groupResponse.status, {
      groupId: groupData?.id,
      groupName: groupData?.name,
      hasData: !!groupData
    })

    // Essayer de récupérer les membres du groupe
    let groupMembers = []
    try {
      const membersResponse = await fetch(`${baseUrl}/api/groups/${groupId}/members?n=10`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      
      if (membersResponse.ok) {
        groupMembers = await membersResponse.json()
      }
    } catch (error) {
      logger.warn('Failed to fetch group members:', error)
    }

    // Essayer de récupérer les rôles du groupe
    let groupRoles = []
    try {
      const rolesResponse = await fetch(`${baseUrl}/api/groups/${groupId}/roles`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      
      if (rolesResponse.ok) {
        groupRoles = await rolesResponse.json()
      }
    } catch (error) {
      logger.warn('Failed to fetch group roles:', error)
    }

    // Enrichir les données du groupe
    const enrichedGroupData = {
      ...groupData,
      members: Array.isArray(groupMembers) ? groupMembers : [],
      roles: Array.isArray(groupRoles) ? groupRoles : [],
    }

    // Store in cache
    globalCache.set(cacheKey, enrichedGroupData)

    return NextResponse.json(enrichedGroupData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
        'X-Cache': 'MISS',
      },
    })

  } catch (error) {
    logger.error('Group API Error:', error)
    logger.apiError('GET', 'group', error)
    
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