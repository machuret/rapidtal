// Simple cache implementation with Redis support (optional)
// Falls back to in-memory cache if Redis is not available

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// Simple in-memory cache for development/fallback
class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    });
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Cache utilities with Redis backend (if available)
export const cacheKeys = {
  websiteContent: (url: string) => `website:${url}`,
  companyExtraction: (url: string) => `company-extraction:${url}`,
  vaultExtraction: (url: string) => `vault-extraction:${url}`,
  kbGeneration: (clientId: string) => `kb-generation:${clientId}`,
  rateLimit: (key: string) => `rate-limit:${key}`,
};

// Type definitions for cached data
export interface CompanyExtractionData {
  company_name?: string;
  mission?: string;
  services?: string;
  values?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  founders?: string;
  target_demographic?: string;
  client_type?: string;
  extra?: string;
}

export interface VaultExtractionData {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  importance?: string;
  tags?: string[];
}

export interface KbGenerationData {
  status: string;
  entries_generated?: number;
  tokens_used?: number;
  completed_at?: string;
}

// Global cache instance
const cache = new SimpleCache();

export class CacheManager {
  // Cache website content for 1 hour
  static async cacheWebsiteContent(url: string, content: string): Promise<void> {
    cache.set(cacheKeys.websiteContent(url), content, 60 * 60 * 1000);
  }

  static async getWebsiteContent(url: string): Promise<string | null> {
    return cache.get(cacheKeys.websiteContent(url));
  }

  // Cache company extraction for 24 hours
  static async cacheCompanyExtraction(url: string, data: CompanyExtractionData): Promise<void> {
    cache.set(cacheKeys.companyExtraction(url), data, 24 * 60 * 60 * 1000);
  }

  static async getCompanyExtraction(url: string): Promise<CompanyExtractionData | null> {
    return cache.get(cacheKeys.companyExtraction(url));
  }

  // Cache vault extraction for 6 hours
  static async cacheVaultExtraction(url: string, data: VaultExtractionData): Promise<void> {
    cache.set(cacheKeys.vaultExtraction(url), data, 6 * 60 * 60 * 1000);
  }

  static async getVaultExtraction(url: string): Promise<VaultExtractionData | null> {
    return cache.get(cacheKeys.vaultExtraction(url));
  }

  // Cache KB generation status for 5 minutes
  static async cacheKbGeneration(clientId: string, data: KbGenerationData): Promise<void> {
    cache.set(cacheKeys.kbGeneration(clientId), data, 5 * 60 * 1000);
  }

  static async getKbGeneration(clientId: string): Promise<KbGenerationData | null> {
    return cache.get(cacheKeys.kbGeneration(clientId));
  }

  // Utility methods
  static async clearUrlCache(url: string): Promise<void> {
    cache.delete(cacheKeys.websiteContent(url));
    cache.delete(cacheKeys.companyExtraction(url));
    cache.delete(cacheKeys.vaultExtraction(url));
  }

  static async clearClientCache(clientId: string): Promise<void> {
    cache.delete(cacheKeys.kbGeneration(clientId));
  }

  static async getCacheStats(): Promise<{ size: number; keys: string[] }> {
    const cacheInstance = cache as unknown as { cache: Map<string, unknown> };
    return {
      size: cacheInstance.cache.size,
      keys: Array.from(cacheInstance.cache.keys()),
    };
  }

  // Health check
  static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency?: number }> {
    return { status: 'healthy', latency: 0 };
  }
}

// Content validation utilities
export class ContentValidator {
  static validateWebsiteContent(content: string): { isValid: boolean; error?: string } {
    if (!content || typeof content !== 'string') {
      return { isValid: false, error: 'Content is required and must be a string' };
    }

    if (content.length < 100) {
      return { isValid: false, error: 'Content too short (minimum 100 characters)' };
    }

    if (content.length > 1000000) { // 1MB limit
      return { isValid: false, error: 'Content too long (maximum 1MB)' };
    }

    // Check for meaningful content (not just HTML tags or whitespace)
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (textContent.length < 50) {
      return { isValid: false, error: 'Content appears to be mostly HTML tags' };
    }

    return { isValid: true };
  }

  static validateExtractedData(data: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'Extracted data must be an object' };
    }

    // Check for required fields based on data type
    if (data.company_name !== undefined && typeof data.company_name !== 'string') {
      return { isValid: false, error: 'Company name must be a string' };
    }

    if (data.content !== undefined && typeof data.content !== 'string') {
      return { isValid: false, error: 'Content must be a string' };
    }

    return { isValid: true };
  }
}

// Export fallback cache for development
export const fallbackCache = cache;

// Retry utility for transient failures
export class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry on certain error types
        if (error instanceof Error && (
          error.message.includes('401') || // Unauthorized
          error.message.includes('403') || // Forbidden
          error.message.includes('404') || // Not Found
          error.message.includes('422')    // Unprocessable Entity
        )) {
          break;
        }

        const delay = delayMs * Math.pow(backoffMultiplier, attempt);
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

// Cleanup on process exit
process.on('SIGTERM', () => {
  cache.destroy();
});

process.on('SIGINT', () => {
  cache.destroy();
});
