import { describe, it, expect } from 'vitest';
import {
  timingSafeEqual,
  extractBearerToken,
  validateBearerToken,
  evaluateAuthorization,
} from '../src/auth.js';

describe('timingSafeEqual', () => {
  it('returns true for matching strings', () => {
    expect(timingSafeEqual('secret_key_123', 'secret_key_123')).toBe(true);
    expect(timingSafeEqual('', '')).toBe(true);
  });

  it('returns false for mismatched strings or differing lengths', () => {
    expect(timingSafeEqual('secret_key_123', 'secret_key_124')).toBe(false);
    expect(timingSafeEqual('secret_key_123', 'secret')).toBe(false);
    expect(timingSafeEqual('secret', 'secret_key_123')).toBe(false);
    expect(timingSafeEqual('a', 'b')).toBe(false);
  });
});

describe('extractBearerToken', () => {
  it('extracts token properly from Bearer scheme', () => {
    expect(extractBearerToken('Bearer my_secret_token')).toBe('my_secret_token');
    expect(extractBearerToken('bearer lower_case_bearer')).toBe('lower_case_bearer');
    expect(extractBearerToken('  Bearer   trimmed_token  ')).toBe('trimmed_token');
  });

  it('returns null for missing, non-Bearer, or malformed headers', () => {
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken(null)).toBeNull();
    expect(extractBearerToken('')).toBeNull();
    expect(extractBearerToken('Basic dXNlcjpwYXNz')).toBeNull();
    expect(extractBearerToken('Bearer')).toBeNull();
    expect(extractBearerToken('Bearer token extra')).toBeNull();
  });
});

describe('validateBearerToken', () => {
  const expectedKey = 'test_access_key_999';

  it('validates matching key', () => {
    expect(validateBearerToken(`Bearer ${expectedKey}`, expectedKey)).toBe(true);
  });

  it('rejects mismatching key or missing headers', () => {
    expect(validateBearerToken('Bearer wrong_key', expectedKey)).toBe(false);
    expect(validateBearerToken(null, expectedKey)).toBe(false);
    expect(validateBearerToken('', expectedKey)).toBe(false);
    expect(validateBearerToken(`Bearer ${expectedKey}`, '')).toBe(false);
  });
});

describe('evaluateAuthorization', () => {
  const expectedKey = 'poe_secret_env_key';

  it('succeeds with 200 on authorized header', () => {
    const res = evaluateAuthorization(`Bearer ${expectedKey}`, expectedKey);
    expect(res.authorized).toBe(true);
    expect(res.status).toBe(200);
  });

  it('fails with 401 when header is missing', () => {
    const res = evaluateAuthorization(null, expectedKey);
    expect(res.authorized).toBe(false);
    expect(res.status).toBe(401);
  });

  it('fails with 401 on mismatched token', () => {
    const res = evaluateAuthorization('Bearer invalid_token', expectedKey);
    expect(res.authorized).toBe(false);
    expect(res.status).toBe(401);
  });

  it('fails with 500 when expected key is empty or unconfigured', () => {
    const res = evaluateAuthorization('Bearer some_token', '');
    expect(res.authorized).toBe(false);
    expect(res.status).toBe(500);
  });
});
