import { describe, it, expect } from 'vitest';
import { evaluateRegex, checkCatastrophicBacktrackingRisk } from '../src/evaluator.js';

describe('Real-World Domain Regex Patterns & ReDoS Defense', () => {
  describe('Semantic Versioning 2.0 Specification Regex', () => {
    const semverRegex =
      '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-([0-9a-zA-Z.-]+))?(?:\\+([0-9a-zA-Z.-]+))?$';

    it('validates standard SemVer strings and extracts major, minor, patch, pre-release, and build metadata', () => {
      const samples = [
        '1.0.0',
        '2.1.3-alpha.1',
        '3.0.0-beta+exp.sha.5114f85',
        '0.3.7-rc.2+20130313144700',
        '1.2.3----RC-SNAPSHOT.12.9.1--.12',
        'invalid.version',
        '1.2',
        '01.2.3',
      ];

      const report = evaluateRegex(semverRegex, '', samples);
      expect(report.isSafe).toBe(true);

      const valid1 = report.samples.find((s) => s.sample === '1.0.0');
      expect(valid1?.matched).toBe(true);
      expect(valid1?.matchGroups[1]).toBe('1'); // Major
      expect(valid1?.matchGroups[2]).toBe('0'); // Minor
      expect(valid1?.matchGroups[3]).toBe('0'); // Patch

      const preRelease = report.samples.find((s) => s.sample === '2.1.3-alpha.1');
      expect(preRelease?.matched).toBe(true);
      expect(preRelease?.matchGroups[4]).toBe('alpha.1'); // Pre-release

      const buildMeta = report.samples.find((s) => s.sample === '3.0.0-beta+exp.sha.5114f85');
      expect(buildMeta?.matched).toBe(true);
      expect(buildMeta?.matchGroups[4]).toBe('beta');
      expect(buildMeta?.matchGroups[5]).toBe('exp.sha.5114f85'); // Build

      const invalidLeadingZero = report.samples.find((s) => s.sample === '01.2.3');
      expect(invalidLeadingZero?.matched).toBe(false);

      const invalidIncomplete = report.samples.find((s) => s.sample === '1.2');
      expect(invalidIncomplete?.matched).toBe(false);
    });
  });

  describe('ISO 8601 & RFC 3339 Strict Timestamp Dissector', () => {
    const iso8601Regex =
      '^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])T([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)(?:\\.(\\d+))?(Z|[+-](?:[01]\\d|2[0-3]):[0-5]\\d)$';

    it('dissects ISO dates with UTC indicator and timezone offsets', () => {
      const samples = [
        '2024-10-14T10:24:00Z',
        '2024-03-29T14:15:30.450+05:30',
        '1999-12-31T23:59:59-08:00',
        '2024-13-01T00:00:00Z', // Invalid month 13
        '2024-10-14 10:24:00',   // Missing T
        'not a date',
      ];

      const report = evaluateRegex(iso8601Regex, '', samples);
      expect(report.isSafe).toBe(true);

      const utcSample = report.samples.find((s) => s.sample === '2024-10-14T10:24:00Z');
      expect(utcSample?.matched).toBe(true);
      expect(utcSample?.matchGroups[1]).toBe('2024');
      expect(utcSample?.matchGroups[2]).toBe('10');
      expect(utcSample?.matchGroups[3]).toBe('14');
      expect(utcSample?.matchGroups[8]).toBe('Z');

      const offsetSample = report.samples.find((s) => s.sample === '2024-03-29T14:15:30.450+05:30');
      expect(offsetSample?.matched).toBe(true);
      expect(offsetSample?.matchGroups[7]).toBe('450'); // Milliseconds
      expect(offsetSample?.matchGroups[8]).toBe('+05:30'); // Timezone

      const invalidMonth = report.samples.find((s) => s.sample === '2024-13-01T00:00:00Z');
      expect(invalidMonth?.matched).toBe(false);
    });
  });

  describe('IPv4 CIDR & IPv6 Network Address Matcher', () => {
    const ipv4CidrRegex =
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\/(?:[0-9]|[12][0-9]|3[0-2]))?$';

    it('matches valid IPv4 addresses with optional CIDR prefix', () => {
      const samples = [
        '192.168.1.1',
        '10.0.0.1/24',
        '172.16.254.1/16',
        '0.0.0.0/0',
        '255.255.255.255/32',
        '256.100.0.1', // Out of range
        '192.168.1.1/33', // Out of range CIDR
        'hello.world',
      ];

      const report = evaluateRegex(ipv4CidrRegex, '', samples);
      expect(report.isSafe).toBe(true);

      expect(report.samples.find((s) => s.sample === '192.168.1.1')?.matched).toBe(true);
      expect(report.samples.find((s) => s.sample === '10.0.0.1/24')?.matched).toBe(true);
      expect(report.samples.find((s) => s.sample === '0.0.0.0/0')?.matched).toBe(true);
      expect(report.samples.find((s) => s.sample === '256.100.0.1')?.matched).toBe(false);
      expect(report.samples.find((s) => s.sample === '192.168.1.1/33')?.matched).toBe(false);
    });
  });

  describe('Full URL Dissector with Protocol, Host, Port, Path, and Query', () => {
    const urlRegex =
      '^(https?):\\/\\/([^:\\/\\s]+)(?::(\\d+))?(\\/[^\\?\\#\\s]*)?(?:\\?([^\\#\\s]*))?(?:\\#(.*))?$';

    it('dissects full web URLs into constituent components', () => {
      const url = 'https://api.example.com:8443/v1/users/profile?active=true&sort=desc#tokens';
      const report = evaluateRegex(urlRegex, '', [url]);

      expect(report.isSafe).toBe(true);
      const match = report.samples[0];
      expect(match?.matched).toBe(true);
      expect(match?.matchGroups[1]).toBe('https');
      expect(match?.matchGroups[2]).toBe('api.example.com');
      expect(match?.matchGroups[3]).toBe('8443');
      expect(match?.matchGroups[4]).toBe('/v1/users/profile');
      expect(match?.matchGroups[5]).toBe('active=true&sort=desc');
      expect(match?.matchGroups[6]).toBe('tokens');
    });
  });

  describe('ReDoS Safety Guard Precision (No False Positives & Strong Defense)', () => {
    it('approves legitimate production regexes without false positives', () => {
      const legitimatePatterns = [
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        '^\\+?[1-9]\\d{1,14}$', // E.164 phone
        '^[A-Z]{5}[0-9]{4}[A-Z]$', // PAN card
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', // UUID
      ];

      for (const pattern of legitimatePatterns) {
        const check = checkCatastrophicBacktrackingRisk(pattern);
        expect(check.isSafe).toBe(true);
      }
    });

    it('blocks classic catastrophic backtracking bombs', () => {
      const redosBombs = [
        '(a+)+',
        '(x+)*',
        '([0-9]+)+',
        '([a-z]+)+',
        '(a+)+$',
      ];

      for (const bomb of redosBombs) {
        const check = checkCatastrophicBacktrackingRisk(bomb);
        expect(check.isSafe).toBe(false);
        expect(check.warning).toBeDefined();
      }
    });
  });
});
