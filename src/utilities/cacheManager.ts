interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  version: string;
  metadata?: Record<string, any>;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  enablePersistence: boolean;
  storageKey: string;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private version: string = '1.0.0';

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      enablePersistence: true,
      storageKey: 'whosonset_cache',
      ...config
    };

    this.loadFromStorage();
    this.startCleanupInterval();
  }

  static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, ttl?: number, metadata?: Record<string, any>): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      version: this.version,
      metadata
    };

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T>;
    
    if (!entry) {
      return null;
    }

    // Check if entry is expired
    if (this.isExpired(entry)) {
      this.delete(key);
      return null;
    }

    // Check version compatibility
    if (entry.version !== this.version) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Get cache entry with metadata
   */
  getWithMetadata<T>(key: string): { data: T; metadata?: Record<string, any> } | null {
    const entry = this.cache.get(key) as CacheEntry<T>;
    
    if (!entry || this.isExpired(entry) || entry.version !== this.version) {
      return null;
    }

    return {
      data: entry.data,
      metadata: entry.metadata
    };
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry) && entry.version === this.version;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
    expiredEntries: number;
  } {
    let expiredCount = 0;
    this.cache.forEach(entry => {
      if (this.isExpired(entry)) {
        expiredCount++;
      }
    });

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // Would need to track hits/misses
      totalHits: 0,
      totalMisses: 0,
      expiredEntries: expiredCount
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all valid entries
   */
  entries<T>(): Array<{ key: string; data: T; metadata?: Record<string, any> }> {
    const validEntries: Array<{ key: string; data: T; metadata?: Record<string, any> }> = [];
    
    this.cache.forEach((entry, key) => {
      if (!this.isExpired(entry) && entry.version === this.version) {
        validEntries.push({
          key,
          data: entry.data as T,
          metadata: entry.metadata
        });
      }
    });

    return validEntries;
  }

  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let invalidatedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (typeof pattern === 'string') {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      } else {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
    });

    keysToDelete.forEach(key => {
      if (this.delete(key)) {
        invalidatedCount++;
      }
    });

    return invalidatedCount;
  }

  /**
   * Set cache configuration
   */
  setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Preload data with async function
   */
  async preload<T>(
    key: string, 
    loader: () => Promise<T>, 
    ttl?: number,
    metadata?: Record<string, any>
  ): Promise<T> {
    // Check if we already have valid data
    const existing = this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    try {
      const data = await loader();
      this.set(key, data, ttl, metadata);
      return data;
    } catch (error) {
      console.error(`Failed to preload cache for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get or set with async loader
   */
  async getOrSet<T>(
    key: string, 
    loader: () => Promise<T>, 
    ttl?: number,
    metadata?: Record<string, any>
  ): Promise<T> {
    const existing = this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    return this.preload(key, loader, ttl, metadata);
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private startCleanupInterval(): void {
    // Clean up expired entries every minute
    setInterval(() => {
      const keysToDelete: string[] = [];
      
      this.cache.forEach((entry, key) => {
        if (this.isExpired(entry)) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.delete(key));
    }, 60 * 1000);
  }

  private saveToStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        version: this.version,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) return;

      const data = JSON.parse(stored);
      
      // Check if stored data is compatible
      if (data.version !== this.version) {
        localStorage.removeItem(this.config.storageKey);
        return;
      }

      // Check if data is not too old (24 hours)
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(this.config.storageKey);
        return;
      }

      this.cache = new Map(data.cache);
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
      localStorage.removeItem(this.config.storageKey);
    }
  }
}

// Specialized cache instances
export const jobCache = CacheManager.getInstance({
  maxSize: 50,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  storageKey: 'whosonset_job_cache'
});

export const userCache = CacheManager.getInstance({
  maxSize: 20,
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  storageKey: 'whosonset_user_cache'
});

export const searchCache = CacheManager.getInstance({
  maxSize: 30,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  storageKey: 'whosonset_search_cache'
});

// Cache keys constants
export const CACHE_KEYS = {
  JOBS: {
    ALL: 'jobs:all',
    BY_ID: (id: string) => `jobs:${id}`,
    BY_DEPARTMENT: (dept: string) => `jobs:dept:${dept}`,
    BY_LOCATION: (location: string) => `jobs:location:${location}`,
    SEARCH: (query: string) => `jobs:search:${query}`,
  },
  USERS: {
    PROFILE: (id: string) => `users:profile:${id}`,
    APPLICATIONS: (id: string) => `users:applications:${id}`,
    SAVED_JOBS: (id: string) => `users:saved:${id}`,
  },
  SEARCH: {
    RECENT: 'search:recent',
    SUGGESTIONS: (query: string) => `search:suggestions:${query}`,
  }
} as const;

export default CacheManager; 