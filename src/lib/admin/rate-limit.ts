type AttemptWindow = {
  count: number;
  resetAt: number;
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;
const attempts = new Map<string, AttemptWindow>();

export function consumeLoginAttempt(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  attempts.set(key, current);
  return { allowed: true };
}

export function clearLoginAttemptWindow(key: string): void {
  attempts.delete(key);
}
