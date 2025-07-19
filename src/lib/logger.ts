type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'api' | 'data';

interface LogConfig {
  enabled: boolean;
  debugMode: boolean;
  showTimestamp: boolean;
  colors: Record<LogLevel, string>;
  badges: Record<LogLevel, string>;
}

class Logger {
  private config: LogConfig = {
    enabled: true,
    debugMode: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    showTimestamp: true,
    colors: {
      debug: '#6B7280', // gray-500
      info: '#3B82F6',  // blue-500
      warn: '#F59E0B',  // amber-500
      error: '#EF4444', // red-500
      api: '#10B981',   // emerald-500
      data: '#8B5CF6',  // violet-500
    },
    badges: {
      debug: '🔍 DEBUG',
      info: 'ℹ️ INFO',
      warn: '⚠️ WARN',
      error: '❌ ERROR',
      api: '🌐 API',
      data: '📊 DATA',
    }
  };

  private formatMessage(level: LogLevel, message: string, data?: unknown): (string | unknown)[] {
    const timestamp = this.config.showTimestamp ? new Date().toISOString() : '';
    const badge = this.config.badges[level];
    const formattedMessage = `${timestamp} ${badge} ${message}`;
    
    return data !== undefined ? [formattedMessage, data] : [formattedMessage];
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    // In production, only show info, warn, error, and api logs
    if (!this.config.debugMode && (level === 'debug' || level === 'data')) {
      return false;
    }
    
    return true;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.shouldLog(level)) return;

    const args = this.formatMessage(level, message, data);
    const color = this.config.colors[level];
    
    if (typeof window !== 'undefined') {
      // Client-side logging with colors
      const styles = `
        background: ${color}; 
        color: white; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-weight: bold;
        margin-right: 8px;
      `;
      
      // Always log to console with style
      if (data !== undefined) {
        console.log(`%c${this.config.badges[level]}`, styles, message, data);
      } else {
        console.log(`%c${this.config.badges[level]}`, styles, message);
      }
      
      // Also log without style for debugging
      if (this.config.debugMode) {
        console.log(`[${this.config.badges[level]}] ${message}`, data || '');
      }
    } else {
      // Server-side logging (plain text)
      if (level === 'error') {
        console.error(...args);
      } else if (level === 'warn') {
        console.warn(...args);
      } else {
        console.log(...args);
      }
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  api(message: string, data?: unknown) {
    this.log('api', message, data);
  }

  data(message: string, data?: unknown) {
    this.log('data', message, data);
  }

  // Utility methods for API calls
  apiRequest(method: string, url: string, params?: unknown) {
    this.api(`${method} ${url}`, params ? { params } : undefined);
  }

  apiResponse(method: string, url: string, status: number, data?: unknown) {
    this.api(`${method} ${url} → ${status}`, data);
  }

  apiError(method: string, url: string, error: unknown) {
    this.error(`${method} ${url} failed`, error);
  }

  // Configuration methods
  setDebugMode(enabled: boolean) {
    this.config.debugMode = enabled;
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }
}

export const logger = new Logger();

// Type guard for error objects
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Helper to safely stringify objects
export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}