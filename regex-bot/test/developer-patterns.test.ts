import { describe, it, expect } from 'vitest';
import { evaluateRegex } from '../src/evaluator.js';

describe('Developer & Engineering Regex Domain Patterns', () => {
  describe('JSON Web Token (JWT) Format Verification', () => {
    const jwtRegex = '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$';

    it('verifies standard Base64URL 3-part JWT tokens and rejects malformed tokens', () => {
      const samples = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        'header.payload.signature',
        'invalid-single-part-token',
        'header.payload', // Only 2 parts
        'header.payload.signature.extra', // 4 parts
        'header..signature', // Empty payload segment
      ];

      const report = evaluateRegex(jwtRegex, '', samples);
      expect(report.isSafe).toBe(true);

      expect(report.samples[0]?.matched).toBe(true);
      expect(report.samples[1]?.matched).toBe(true);
      expect(report.samples[2]?.matched).toBe(false);
      expect(report.samples[3]?.matched).toBe(false);
      expect(report.samples[4]?.matched).toBe(false);
      expect(report.samples[5]?.matched).toBe(false);
    });
  });

  describe('Conventional Commits Specification Validator', () => {
    const conventionalCommitRegex =
      '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\\(([a-z0-9-_]+)\\))?:\\s+(.+)$';

    it('dissects conventional commit messages into type, scope, and description', () => {
      const samples = [
        'feat(auth): implement OAuth2 token refresh flow',
        'fix: resolve race condition in database connection pool',
        'test(ocr): add boundary deskew unit tests',
        'chore(deps): bump vite from 5.1 to 5.4',
        'Invalid commit message without colon',
        'random(scope): unknown type',
      ];

      const report = evaluateRegex(conventionalCommitRegex, '', samples);
      expect(report.isSafe).toBe(true);

      const match1 = report.samples[0];
      expect(match1?.matched).toBe(true);
      expect(match1?.matchGroups[1]).toBe('feat');
      expect(match1?.matchGroups[2]).toBe('auth');
      expect(match1?.matchGroups[3]).toBe('implement OAuth2 token refresh flow');

      const match2 = report.samples[1];
      expect(match2?.matched).toBe(true);
      expect(match2?.matchGroups[1]).toBe('fix');
      expect(match2?.matchGroups[2]).toBeUndefined();
      expect(match2?.matchGroups[3]).toBe('resolve race condition in database connection pool');

      expect(report.samples[4]?.matched).toBe(false);
      expect(report.samples[5]?.matched).toBe(false);
    });
  });

  describe('CSS Color Notation Formats (Hex & RGB)', () => {
    const hexColorRegex = '^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$';

    it('matches 3-digit, 6-digit, and 8-digit hexadecimal color values', () => {
      const samples = [
        '#fff',
        '#FFF',
        '#1a2b3c',
        '#1A2B3C',
        '#1a2b3cff', // 8-digit with alpha
        '#12',       // too short
        '#12345',    // invalid 5-digit
        '123456',    // missing hash
        '#gggggg',   // invalid hex characters
      ];

      const report = evaluateRegex(hexColorRegex, '', samples);
      expect(report.isSafe).toBe(true);

      expect(report.samples[0]?.matched).toBe(true);
      expect(report.samples[1]?.matched).toBe(true);
      expect(report.samples[2]?.matched).toBe(true);
      expect(report.samples[3]?.matched).toBe(true);
      expect(report.samples[4]?.matched).toBe(true);
      expect(report.samples[5]?.matched).toBe(false);
      expect(report.samples[6]?.matched).toBe(false);
      expect(report.samples[7]?.matched).toBe(false);
      expect(report.samples[8]?.matched).toBe(false);
    });
  });

  describe('Git SHA-1 & SHA-256 Object Checksum Dissector', () => {
    const gitShaRegex = '^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$';

    it('validates 40-character SHA-1 and 64-character SHA-256 git hashes', () => {
      const samples = [
        'e04605e52efb12bde814556bb4d0c7ec52d452e2', // 40-char SHA-1
        'd621f3404bee88dd0cd7f66401293bb3d4eba6a8', // 40-char SHA-1
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // 64-char SHA-256
        'short-hash',
        'g04605e52efb12bde814556bb4d0c7ec52d452e2', // Non-hex 'g'
      ];

      const report = evaluateRegex(gitShaRegex, '', samples);
      expect(report.isSafe).toBe(true);

      expect(report.samples[0]?.matched).toBe(true);
      expect(report.samples[1]?.matched).toBe(true);
      expect(report.samples[2]?.matched).toBe(true);
      expect(report.samples[3]?.matched).toBe(false);
      expect(report.samples[4]?.matched).toBe(false);
    });
  });
});
