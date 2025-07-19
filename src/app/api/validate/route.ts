import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'username' or 'email' 
    const value = searchParams.get('value') // The username or email to check
    
    if (!type || !value) {
      return NextResponse.json(
        { error: 'Type and value parameters are required' },
        { status: 400 }
      )
    }
    
    if (!['username', 'email'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "username" or "email"' },
        { status: 400 }
      )
    }
    
    const baseUrl = process.env.VRCHAT_BRIDGE_API_URL || 'https://vrchat-bridge.unstealable.cloud'
    
    logger.api(`Validating ${type}: ${value}`)
    
    // Use the auth/exists endpoint for username/email validation
    const validateUrl = `${baseUrl}/api/auth/exists/${type}/${encodeURIComponent(value)}`
    logger.apiRequest('GET', validateUrl, { type, value: value.substring(0, 5) + '***' }) // Log partial value for security
    
    const response = await fetch(validateUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        // If 404, the username/email might not exist (which is good for validation)
        logger.info(`${type} validation: not found (available)`, { type, available: true })
        return NextResponse.json({
          exists: false,
          available: true,
          type,
          message: `${type === 'username' ? 'Username' : 'Email'} is available`,
          timestamp: new Date().toISOString()
        })
      }
      
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    logger.apiResponse('GET', validateUrl, response.status, { exists: !!data })
    
    // Use data.userExists to determine if username/email exists
    const exists = data && data.userExists === true
    
    logger.info(`${type} validation result`, { 
      type, 
      exists, 
      available: !exists 
    })
    
    return NextResponse.json({
      exists,
      available: !exists,
      type,
      message: exists 
        ? `${type === 'username' ? 'Username' : 'Email'} is already taken`
        : `${type === 'username' ? 'Username' : 'Email'} is available`,
      timestamp: new Date().toISOString(),
      ...(exists && { data }) // Include user data if username exists
    })
    
  } catch (error) {
    logger.error('Username/email validation failed', error)
    
    return NextResponse.json({
      exists: null, // null indicates we couldn't check
      available: null,
      type: request.nextUrl.searchParams.get('type'),
      message: error instanceof Error ? error.message : 'Validation check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}