/**
 * Firecrawl Integration for Advanced Web Scraping
 * 
 * This module provides integration with Firecrawl API for enhanced web scraping capabilities.
 * Firecrawl offers better anti-bot detection, JavaScript rendering, and content extraction.
 */

export interface FirecrawlOptions {
  url: string;
  formats?: ('markdown' | 'html' | 'raw' | 'links' | 'screenshot' | 'extract')[];
  includeTags?: string[];
  excludeTags?: string[];
  onlyMainContent?: boolean;
  waitFor?: number;
  screenshotOptions?: {
    fullPage?: boolean;
    quality?: number;
  };
  extract?: {
    schema: Record<string, unknown>;
  };
}

export interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    raw?: string;
    links?: Array<{
      url: string;
      text?: string;
      type?: string;
    }>;
    screenshot?: string;
    extract?: Record<string, unknown>;
    metadata?: {
      title?: string;
      description?: string;
      language?: string;
      keywords?: string[];
      author?: string;
      publishedTime?: string;
      modifiedTime?: string;
    };
  };
  error?: string;
  code?: number;
}

/**
 * Scrape a URL using Firecrawl API
 */
export async function scrapeWithFirecrawl(options: FirecrawlOptions): Promise<FirecrawlResponse> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  const payload: Record<string, unknown> = {
    url: options.url,
  };

  // Add optional parameters
  if (options.formats) {
    payload.formats = options.formats;
  } else {
    payload.formats = ['markdown', 'html'];
  }

  if (options.includeTags) {
    payload.includeTags = options.includeTags;
  }

  if (options.excludeTags) {
    payload.excludeTags = options.excludeTags;
  }

  if (options.onlyMainContent !== undefined) {
    payload.onlyMainContent = options.onlyMainContent;
  }

  if (options.waitFor) {
    payload.waitFor = options.waitFor;
  }

  if (options.screenshotOptions) {
    payload.screenshotOptions = options.screenshotOptions;
  }

  if (options.extract) {
    payload.extract = options.extract;
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        code: response.status,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Scrape multiple URLs in batch using Firecrawl
 */
export async function batchScrapeWithFirecrawl(urls: string[], options: Partial<FirecrawlOptions> = {}): Promise<FirecrawlResponse[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  const payload: Record<string, unknown> = {
    urls: urls,
  };

  // Add optional parameters
  if (options.formats) {
    payload.formats = options.formats;
  } else {
    payload.formats = ['markdown', 'html'];
  }

  if (options.includeTags) {
    payload.includeTags = options.includeTags;
  }

  if (options.excludeTags) {
    payload.excludeTags = options.excludeTags;
  }

  if (options.onlyMainContent !== undefined) {
    payload.onlyMainContent = options.onlyMainContent;
  }

  if (options.waitFor) {
    payload.waitFor = options.waitFor;
  }

  if (options.screenshotOptions) {
    payload.screenshotOptions = options.screenshotOptions;
  }

  if (options.extract) {
    payload.extract = options.extract;
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/batch/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return result.data || [];
  } catch (error) {
    throw new Error(`Batch scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Crawl a website starting from a URL using Firecrawl
 */
export async function crawlWithFirecrawl(
  url: string, 
  options: {
    limit?: number;
    includePaths?: string[];
    excludePaths?: string[];
    maxDepth?: number;
    allowExternalLinks?: boolean;
    formats?: ('markdown' | 'html' | 'raw' | 'links')[];
    onlyMainContent?: boolean;
  } = {}
): Promise<{ id: string }> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  const payload: Record<string, unknown> = {
    url: url,
  };

  if (options.limit) {
    payload.limit = options.limit;
  }

  if (options.includePaths) {
    payload.includePaths = options.includePaths;
  }

  if (options.excludePaths) {
    payload.excludePaths = options.excludePaths;
  }

  if (options.maxDepth) {
    payload.maxDepth = options.maxDepth;
  }

  if (options.allowExternalLinks !== undefined) {
    payload.allowExternalLinks = options.allowExternalLinks;
  }

  if (options.formats) {
    payload.formats = options.formats;
  } else {
    payload.formats = ['markdown', 'html'];
  }

  if (options.onlyMainContent !== undefined) {
    payload.onlyMainContent = options.onlyMainContent;
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return { id: result.id };
  } catch (error) {
    throw new Error(`Crawl initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get crawl status and results
 */
export async function getCrawlStatus(crawlId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data?: unknown[];
  error?: string;
}> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`https://api.firecrawl.dev/v1/crawl/${crawlId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return {
      status: result.status,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    throw new Error(`Failed to get crawl status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
