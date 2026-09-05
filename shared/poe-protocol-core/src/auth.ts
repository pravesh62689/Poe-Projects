/**
 * Constant-time comparison between two strings to prevent timing attacks.
 * Pure JavaScript implementation that works in any runtime (Node.js, Workers, Deno).
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const lenA = a.length;
  const lenB = b.length;
  let mismatch = lenA ^ lenB;

  const maxLen = Math.max(lenA, lenB);
  for (let i = 0; i < maxLen; i++) {
    const charA = i < lenA ? a.charCodeAt(i) : 0;
    const charB = i < lenB ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }

  return mismatch === 0;
}

/**
 * Extracts Bearer token from an Authorization header value.
 */
export function extractBearerToken(authHeader: string | undefined | null): string | null {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && parts[0]?.toLowerCase() === 'bearer') {
    return parts[1] ?? null;
  }
  return null;
}

/**
 * Validates the Authorization header against the expected access key.
 */
export function validateBearerToken(
  authHeader: string | undefined | null,
  expectedKey: string,
): boolean {
  if (!expectedKey || !authHeader) {
    return false;
  }
  const token = extractBearerToken(authHeader);
  if (!token) {
    return false;
  }
  return timingSafeEqual(token, expectedKey);
}

export interface AuthResult {
  authorized: boolean;
  status: number;
  message?: string;
}

/**
 * Evaluates authorization header and returns a standardized status and message.
 */
export function evaluateAuthorization(
  authHeader: string | undefined | null,
  expectedKey: string,
): AuthResult {
  if (!expectedKey) {
    return {
      authorized: false,
      status: 500,
      message: 'Server configuration error: POE_ACCESS_KEY is not configured.',
    };
  }

  if (!authHeader) {
    return {
      authorized: false,
      status: 401,
      message: 'Missing Authorization header.',
    };
  }

  const isValid = validateBearerToken(authHeader, expectedKey);
  if (!isValid) {
    return {
      authorized: false,
      status: 401,
      message: 'Invalid or missing Bearer token.',
    };
  }

  return {
    authorized: true,
    status: 200,
  };
}
