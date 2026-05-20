import { URL } from 'url';

// Allowed domains for scraping (expanded for business use)
const ALLOWED_DOMAINS = [
  // Common business domains
  'example.com',
  'test.com',
  // Popular business and company domains
  'linkedin.com',
  'crunchbase.com',
  'github.com',
  'medium.com',
  'substack.com',
  'wordpress.com',
  'squarespace.com',
  'wix.com',
  'shopify.com',
  'stripe.com',
  'paypal.com',
  'calendly.com',
  'zoom.us',
  'slack.com',
  'notion.so',
  'figma.com',
  'canva.com',
  'airtable.com',
  'trello.com',
  'asana.com',
  'monday.com',
  'hubspot.com',
  'salesforce.com',
  'mailchimp.com',
  'convertkit.com',
  'substack.com',
  'behance.net',
  'dribbble.com',
  'angel.co',
  'producthunt.com',
  'indiehackers.com',
  'ycombinator.com',
  'techcrunch.com',
  'wikipedia.org',
  // Generic TLDs that are commonly used for business
  // Note: This allows any domain with these TLDs for flexibility
];

// Blocked domains (security risk)
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '192.168.',
  '10.',
  '172.16.',
  '172.17.',
  '172.18.',
  '172.19.',
  '172.20.',
  '172.21.',
  '172.22.',
  '172.23.',
  '172.24.',
  '172.25.',
  '172.26.',
  '172.27.',
  '172.28.',
  '172.29.',
  '172.30.',
  '172.31.',
  '169.254.',
  '::1',
  '[::1]',
];

// Allowed protocols
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

// Blocked file extensions
const BLOCKED_EXTENSIONS = [
  '.exe',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.dmg',
  '.pkg',
  '.deb',
  '.rpm',
  '.msi',
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

/**
 * Validates and sanitizes a URL for scraping
 */
export function validateScrapingUrl(url: string): ValidationResult {
  try {
    // Basic URL format validation
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Remove whitespace and trim
    const trimmedUrl = url.trim();
    
    // Parse URL
    const parsedUrl = new URL(trimmedUrl);

    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Check for blocked domains/IP ranges
    const hostname = parsedUrl.hostname.toLowerCase();
    
    for (const blocked of BLOCKED_DOMAINS) {
      if (hostname === blocked || hostname.startsWith(blocked)) {
        return { isValid: false, error: 'Access to this resource is not allowed' };
      }
    }

    // Check if domain is allowed (more flexible approach)
    // Allow most domains except blocked ones, but still check against explicit allowlist
    if (ALLOWED_DOMAINS.length > 0) {
      const isExplicitlyAllowed = ALLOWED_DOMAINS.some(allowed => 
        hostname === allowed || hostname.endsWith('.' + allowed)
      );
      
      // If domain is explicitly allowed, allow it
      if (isExplicitlyAllowed) {
        // Continue with validation
      } else {
        // For other domains, apply additional checks
        const domainParts = hostname.split('.');
        
        // Block suspicious TLDs
        const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.download', '.win'];
        const hasSuspiciousTLD = suspiciousTLDs.some(tld => hostname.endsWith(tld));
        
        if (hasSuspiciousTLD) {
          return { isValid: false, error: 'Domain TLD not allowed for security reasons' };
        }
        
        // Block domains with too many subdomains (potential abuse)
        if (domainParts.length > 4) {
          return { isValid: false, error: 'Domain structure appears suspicious' };
        }
        
        // Block domains with suspicious patterns
        const suspiciousPatterns = [
          /\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}/, // IP-like patterns
          /[a-f0-9]{32,}/i, // Hash-like patterns
          /xn--/, // Punycode (can be used for phishing)
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(hostname))) {
          return { isValid: false, error: 'Domain pattern not allowed for security reasons' };
        }
      }
    }

    // Check for blocked file extensions
    const pathname = parsedUrl.pathname.toLowerCase();
    for (const ext of BLOCKED_EXTENSIONS) {
      if (pathname.endsWith(ext)) {
        return { isValid: false, error: 'File type not allowed for scraping' };
      }
    }

    // Check for suspicious query parameters
    const suspiciousParams = ['file', 'path', 'dir', 'folder', 'document'];
    for (const param of suspiciousParams) {
      if (parsedUrl.searchParams.has(param)) {
        const value = parsedUrl.searchParams.get(param)?.toLowerCase();
        if (value && (value.includes('/') || value.includes('\\'))) {
          return { isValid: false, error: 'Suspicious URL parameters detected' };
        }
      }
    }

    // Remove potentially dangerous query parameters
    const sanitizedParams = new URLSearchParams(parsedUrl.searchParams);
    const dangerousParams = ['file', 'path', 'dir', 'folder', 'document', 'download'];
    
    for (const param of dangerousParams) {
      sanitizedParams.delete(param);
    }

    // Reconstruct sanitized URL
    const sanitizedUrl = new URL(parsedUrl.toString());
    sanitizedUrl.search = sanitizedParams.toString();

    return { 
      isValid: true, 
      sanitizedUrl: sanitizedUrl.toString() 
    };

  } catch {
    return { 
      isValid: false, 
      error: 'Invalid URL format' 
    };
  }
}

/**
 * Checks if a URL is accessible (basic check)
 */
export async function checkUrlAccessibility(url: string): Promise<boolean> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    };

    const response = await fetch(url, {
      method: 'HEAD',
      headers,
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Rate limiting helper (in-memory for now, should use Redis in production)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(private maxRequests: number, private windowMs: number) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this identifier
    let requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (requests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    requests.push(now);
    this.requests.set(identifier, requests);
    
    return true;
  }
}

// Rate limiters for different endpoints
export const dnaScrapeRateLimiter = new RateLimiter(5, 60000); // 5 requests per minute
export const vaultCrawlRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
export const kbGenerateRateLimiter = new RateLimiter(3, 300000); // 3 requests per 5 minutes
