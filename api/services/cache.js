/**
 * cache.js — in-memory response cache for read-only API endpoints.
 *
 * Replaces the old Redis-backed cache. Each server instance keeps its own copy
 * for `ttl` seconds; with a handful of instances at peak, Firestore still sees
 * only a few reads per endpoint per minute.
 *
 * get(key)              → cached value or null
 * set(key, value, ttl)  — stores value, default 60 s TTL
 * invalidate(key)       — deletes one key
 * middleware(ttl)       → Express middleware that caches successful responses
 */

'use strict';

const MAX_ENTRIES = 500;
const store = new Map(); // key -> { value, expiresAt }

function get(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

function set(key, value, ttl = 60) {
  if (store.size >= MAX_ENTRIES) {
    // Drop the oldest entry (Map keeps insertion order).
    store.delete(store.keys().next().value);
  }
  store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
}

function invalidate(key) {
  store.delete(key);
}

/**
 * Express middleware. Caches successful (2xx) JSON responses for `ttl` seconds.
 * Cache key = route path + serialised request body.
 * Adds X-Cache: HIT / MISS header for observability.
 */
function middleware(ttl = 60) {
  return (req, res, next) => {
    const key = `cache:${req.path}:${JSON.stringify(req.body)}`;

    const cached = get(key);
    if (cached !== null) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300) set(key, data, ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

// Kept for compatibility with the old interface; nothing to wire up now.
function init() {}

module.exports = { init, get, set, invalidate, middleware };
