// Global server-side cache implementation
// Cache is shared across all user sessions and persists for 1 hour

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class GlobalCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if cache has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set data in cache with 1-hour expiration
   */
  set<T>(key: string, data: T): void {
    const now = Date.now()
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    }
    
    this.cache.set(key, entry)
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clean up expired entries (garbage collection)
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number
    expiredEntries: number
    activeEntries: number
  } {
    const now = Date.now()
    let expiredCount = 0
    let activeCount = 0

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredCount++
      } else {
        activeCount++
      }
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      activeEntries: activeCount
    }
  }

  /**
   * Generate cache key for VRChat API requests
   */
  generateKey(type: 'user' | 'world' | 'group', id: string): string {
    return `vrchat:${type}:${id}`
  }

  /**
   * Generate cache key for search requests
   */
  generateSearchKey(type: string, query: string, method: string): string {
    return `vrchat:search:${type}:${method}:${encodeURIComponent(query)}`
  }
}

// Create singleton instance for global cache
const globalCache = new GlobalCache()

// Cleanup expired entries every 30 minutes
setInterval(() => {
  globalCache.cleanup()
}, 30 * 60 * 1000)

export { globalCache }
export type { CacheEntry }