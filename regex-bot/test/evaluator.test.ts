import { describe, it, expect } from 'vitest';
import {
  evaluateRegex,
  checkCatastrophicBacktrackingRisk,
  extractInstructionAndSamples,
} from '../src/evaluator.js';

describe('checkCatastrophicBacktrackingRisk', () => {
  it('identifies dangerous nested quantifiers', () => {
    const dangerous1 = checkCatastrophicBacktrackingRisk('(a+)+');
    expect(dangerous1.isSafe).toBe(false);
    expect(dangerous1.warning).toContain('Catastrophic Backtracking');

    const dangerous2 = checkCatastrophicBacktrackingRisk('([0-9]+)*');
    expect(dangerous2.isSafe).toBe(false);

    const dangerous3 = checkCatastrophicBacktrackingRisk('([a-zA-Z]+)+$');
    expect(dangerous3.isSafe).toBe(false);
  });

  it('permits safe and linear regular expressions', () => {
    expect(checkCatastrophicBacktrackingRisk('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$').isSafe).toBe(true);
    expect(checkCatastrophicBacktrackingRisk('^\\d{4}-\\d{2}-\\d{2}$').isSafe).toBe(true);
    expect(checkCatastrophicBacktrackingRisk('[A-Z]{5}[0-9]{4}[A-Z]{1}').isSafe).toBe(true);
  });
});

describe('evaluateRegex', () => {
  it('matches valid samples and distinguishes non-matching samples (happy path)', () => {
    const pattern = '^\\d{3}-\\d{4}$';
    const samples = ['123-4567', '999-0000', 'abc-defg', '1234567'];

    const report = evaluateRegex(pattern, '', samples);
    expect(report.isSafe).toBe(true);
    expect(report.samples).toHaveLength(4);

    expect(report.samples[0]?.matched).toBe(true);
    expect(report.samples[1]?.matched).toBe(true);
    expect(report.samples[2]?.matched).toBe(false);
    expect(report.samples[3]?.matched).toBe(false);
  });

  it('safely handles empty samples list', () => {
    const report = evaluateRegex('\\w+', '', []);
    expect(report.isSafe).toBe(true);
    expect(report.samples).toHaveLength(0);
  });

  it('gracefully reports syntax errors in malformed regex patterns', () => {
    const report = evaluateRegex('[unclosed-bracket', '', ['sample']);
    expect(report.isSafe).toBe(false);
    expect(report.securityWarning).toContain('Invalid regular expression');
    expect(report.samples[0]?.error).toContain('Syntax error');
  });

  it('defensively aborts execution on adversarial catastrophic backtracking patterns', () => {
    const report = evaluateRegex('(a+)+$', '', ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!']);
    expect(report.isSafe).toBe(false);
    expect(report.securityWarning).toContain('Catastrophic Backtracking');
    expect(report.samples[0]?.error).toContain('failed safety verification');
  });
});

describe('extractInstructionAndSamples', () => {
  it('extracts instruction and labeled test samples', () => {
    const prompt = `
      Please create a regex for Indian mobile numbers.
      Sample: +91 9876543210
      Test: 09876543210
      Sample: invalid-number
    `;

    const res = extractInstructionAndSamples(prompt);
    expect(res.instruction).toContain('Indian mobile numbers');
    expect(res.samples).toEqual(['+91 9876543210', '09876543210', 'invalid-number']);
  });

  it('returns empty samples when none provided to allow unverified disclaimer', () => {
    const res = extractInstructionAndSamples('Match any email address');
    expect(res.samples).toHaveLength(0);
  });
});
