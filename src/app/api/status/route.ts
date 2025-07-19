import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const baseUrl = process.env.VRCHAT_BRIDGE_API_URL || 'https://vrchat-bridge.unstealable.cloud'
    
    logger.api('Checking VRChat Bridge API connectivity')
    
    // Check VRChat connectivity status
    const connectivityUrl = `${baseUrl}/api/vrchat/connected`
    logger.apiRequest('GET', connectivityUrl, { purpose: 'connectivity check' })
    
    const response = await fetch(connectivityUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (!response.ok) {
      logger.apiError('GET', connectivityUrl, `HTTP ${response.status}`)
      return NextResponse.json({
        connected: false,
        status: 'error',
        message: `VRChat Bridge API returned ${response.status}`,
        timestamp: new Date().toISOString()
      }, { 
        status: 200, // We still return 200 but with connected: false
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      })
    }
    
    const data = await response.json()
    logger.apiResponse('GET', connectivityUrl, response.status, data)
    
    // Check if the response indicates VRChat is connected
    const isConnected = data.connected === true || data.status === 'connected'
    
    logger.info(`VRChat connectivity status: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`, {
      connected: isConnected,
      apiResponse: data
    })
    
    return NextResponse.json({
      connected: isConnected,
      status: isConnected ? 'connected' : 'disconnected',
      message: isConnected ? 'VRChat API is connected' : 'VRChat API is disconnected',
      timestamp: new Date().toISOString(),
      apiData: data // Include original response for debugging
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Don't cache status
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    logger.error('VRChat connectivity check failed', error)
    
    return NextResponse.json({
      connected: false,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { 
      status: 200, // Still return 200 so frontend can handle the status
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}