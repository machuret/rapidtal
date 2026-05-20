import { CacheManager, RetryManager, ContentValidator, cache } from '@/lib/cache';

describe('Cache Manager', () => {
  beforeEach(() => {
    // Clear cache before each test
    (cache as any).cache.clear();
  });

  describe('Website Content Caching', () => {
    test('should cache and retrieve website content', () => {
      const url = 'https://example.com';
      const content = 'Example website content';
      
      CacheManager.cacheWebsiteContent(url, content);
      const retrieved = CacheManager.getWebsiteContent(url);
      
      expect(retrieved).toBe(content);
    });

    test('should return null for non-existent cache entries', () => {
      const result = CacheManager.getWebsiteContent('https://nonexistent.com');
      expect(result).toBeNull();
    });

    test('should handle cache expiration', (done) => {
      const url = 'https://example.com';
      const content = 'Test content';
      
      // Cache with very short TTL
      CacheManager.cacheWebsiteContent(url, content);
      
      // Should be available immediately
      expect(CacheManager.getWebsiteContent(url)).toBe(content);
      
      // Should expire after TTL
      setTimeout(() => {
        expect(CacheManager.getWebsiteContent(url)).toBeNull();
        done();
      }, 20);
    });
  });

  describe('Company Extraction Caching', () => {
    test('should cache and retrieve company extraction data', () => {
      const url = 'https://company.com';
      const data = { company_name: 'Test Company', services: 'Testing' };
      
      CacheManager.cacheCompanyExtraction(url, data);
      const retrieved = CacheManager.getCompanyExtraction(url);
      
      expect(retrieved).toEqual(data);
    });
  });

  describe('Cache Management', () => {
    test('should clear URL cache', () => {
      const url = 'https://example.com';
      
      CacheManager.cacheWebsiteContent(url, 'content');
      CacheManager.cacheCompanyExtraction(url, { company_name: 'test' });
      
      CacheManager.clearUrlCache(url);
      
      expect(CacheManager.getWebsiteContent(url)).toBeNull();
      expect(CacheManager.getCompanyExtraction(url)).toBeNull();
    });

    test('should get cache stats', () => {
      CacheManager.cacheWebsiteContent('https://example1.com', 'content1');
      CacheManager.cacheWebsiteContent('https://example2.com', 'content2');
      
      const stats = CacheManager.getCacheStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('website:https://example1.com');
      expect(stats.keys).toContain('website:https://example2.com');
    });
  });
});

describe('Retry Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should succeed on first attempt', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success');
    
    const result = await RetryManager.withRetry(mockOperation);
    
    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  test('should retry on transient failures', async () => {
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValue('success');
    
    const result = await RetryManager.withRetry(mockOperation, 2, 10);
    
    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(2);
  });

  test('should fail after max retries', async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error('Persistent failure'));
    
    await expect(RetryManager.withRetry(mockOperation, 2, 10))
      .rejects.toThrow('Persistent failure');
    
    expect(mockOperation).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  test('should not retry on 4xx errors', async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error('404 Not Found'));
    
    await expect(RetryManager.withRetry(mockOperation, 2, 10))
      .rejects.toThrow('404 Not Found');
    
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  test('should use exponential backoff', async () => {
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');
    
    const startTime = Date.now();
    await RetryManager.withRetry(mockOperation, 3, 100);
    const endTime = Date.now();
    
    // Should have waited for backoff delays
    expect(endTime - startTime).toBeGreaterThan(200); // 100ms + 200ms backoff
  });
});

describe('Content Validator', () => {
  describe('validateWebsiteContent', () => {
    test('should reject empty content', () => {
      const result = ContentValidator.validateWebsiteContent('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content is required and must be a string');
    });

    test('should reject non-string content', () => {
      const result = ContentValidator.validateWebsiteContent(null as any);
      expect(result.isValid).toBe(false);
    });

    test('should reject content that is too short', () => {
      const result = ContentValidator.validateWebsiteContent('Short');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content too short (minimum 100 characters)');
    });

    test('should reject content that is too long', () => {
      const longContent = 'x'.repeat(1000001);
      const result = ContentValidator.validateWebsiteContent(longContent);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content too long (maximum 1MB)');
    });

    test('should reject content that is mostly HTML tags', () => {
      const htmlContent = '<div><p><span>Text</span></p></div>';
      const result = ContentValidator.validateWebsiteContent(htmlContent);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content appears to be mostly HTML tags');
    });

    test('should accept valid content', () => {
      const validContent = 'This is a valid website content with enough text to pass the minimum length requirement. It contains meaningful text that would be useful for processing.';
      const result = ContentValidator.validateWebsiteContent(validContent);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateExtractedData', () => {
    test('should reject null data', () => {
      const result = ContentValidator.validateExtractedData(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Extracted data must be an object');
    });

    test('should reject non-object data', () => {
      const result = ContentValidator.validateExtractedData('string' as any);
      expect(result.isValid).toBe(false);
    });

    test('should reject invalid company_name type', () => {
      const result = ContentValidator.validateExtractedData({ company_name: 123 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Company name must be a string');
    });

    test('should reject invalid content type', () => {
      const result = ContentValidator.validateExtractedData({ content: 123 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content must be a string');
    });

    test('should accept valid extracted data', () => {
      const validData = {
        company_name: 'Test Company',
        content: 'Some content',
        services: 'Testing services'
      };
      const result = ContentValidator.validateExtractedData(validData);
      expect(result.isValid).toBe(true);
    });
  });
});
