import { SourceError } from "./errors";

const attempts = new Map<string, { count: number; resetAt: number }>();

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) throw new SourceError("Please wait a moment before trying this again.", 429, "RATE_LIMITED");
  current.count += 1;
}
