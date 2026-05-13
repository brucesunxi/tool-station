const requestCounts = new Map<string, { count: number; resetAt: number }>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  requestCounts.forEach((val, key) => {
    if (val.resetAt < now) requestCounts.delete(key)
  })
}, 300_000)

interface RateLimitOptions {
  interval: number  // window in milliseconds
  maxRequests: number
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { interval: 60_000, maxRequests: 20 }
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = requestCounts.get(key)

  if (!entry || entry.resetAt < now) {
    requestCounts.set(key, { count: 1, resetAt: now + options.interval })
    return { allowed: true, remaining: options.maxRequests - 1 }
  }

  entry.count++
  const remaining = options.maxRequests - entry.count

  if (entry.count > options.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining }
}
