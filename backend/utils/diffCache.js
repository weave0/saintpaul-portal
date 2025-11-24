/**
 * Simple in-memory LRU cache for diff results
 * Stores precomputed diff responses by "from|to" key
 */

class DiffCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  _generateKey(fromId, toId) {
    return `${fromId}|${toId}`;
  }

  get(fromId, toId) {
    const key = this._generateKey(fromId, toId);
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Refresh LRU order
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(fromId, toId, data) {
    const key = this._generateKey(fromId, toId);
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = new DiffCache(100);
