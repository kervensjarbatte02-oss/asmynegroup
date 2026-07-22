type RateLimitEntry = {
  timestamps: number[];
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

declare global {
  var __asmyneRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = global.__asmyneRateLimitStore ?? new Map<string, RateLimitEntry>();
global.__asmyneRateLimitStore = store;

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    store.set(key, entry);
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0,
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, limit - entry.timestamps.length),
  };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}
