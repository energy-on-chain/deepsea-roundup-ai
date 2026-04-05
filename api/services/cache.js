/**
 * Redis cache service
 * Wraps a Redis client with a simple get/set/middleware interface.
 * The middleware(ttl) function intercepts res.json() — on a MISS it caches the response;
 * on a HIT it returns early with an X-Cache: HIT header.
 */

let _redisClient = null;

function init(redisClient) {
  _redisClient = redisClient;
}

async function get(key) {
  if (!_redisClient) return null;
  try {
    const value = await _redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Cache GET error:', err);
    return null;
  }
}

async function set(key, value, ttlSeconds = 60) {
  if (!_redisClient) return;
  try {
    await _redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error('Cache SET error:', err);
  }
}

/**
 * Express middleware factory.
 * Usage: router.get('/some-route', cache.middleware(60), handler)
 * TTL defaults to 60 seconds.
 */
function middleware(ttlSeconds = 60) {
  return async (req, res, next) => {
    // Include request body in cache key for POST requests so different
    // body params (e.g. different species) get separate cache entries.
    const bodyKey = req.method === 'POST' && req.body
      ? ':' + JSON.stringify(req.body)
      : '';
    const key = `cache:${req.originalUrl}${bodyKey}`;
    const cached = await get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }
    // Intercept res.json to cache the response on a MISS
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      set(key, body, ttlSeconds).catch(() => {}); // fire-and-forget
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };
    next();
  };
}

module.exports = { init, get, set, middleware };
