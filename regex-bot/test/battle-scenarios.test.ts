import { describe, it, expect } from 'vitest';
import { checkCatastrophicBacktrackingRisk, evaluateRegex } from '../src/evaluator.js';
import { synthesizePatternFromHeuristics } from '../src/llm.js';
import { handleRegexWorkerRequest } from '../src/worker.js';

describe('Real-World Battle Scenarios: regex-bot', () => {
  const testKey = 'test_regex_battle_key';

  describe('Scenario 11: Indian Mobile Numbers', () => {
    it('generates compliant pattern for Indian mobile numbers and validates formats', () => {
      const proposal = synthesizePatternFromHeuristics('Match Indian mobile numbers');
      expect(proposal.pattern).toContain('[6-9]');
      expect(proposal.explanation).toContain('Indian numbering plan');

      const samples = [
        '+91 98765 43210',
        '09876543210',
        '9876543210',
        '+91-98765-43210',
        '1234567890', // invalid start
        '0987654321',  // 9 digits
      ];

      const report = evaluateRegex(proposal.pattern, proposal.flags, samples);
      expect(report.isSafe).toBe(true);
      expect(report.samples[0]?.matched).toBe(true);
      expect(report.samples[1]?.matched).toBe(true);
      expect(report.samples[2]?.matched).toBe(true);
      expect(report.samples[3]?.matched).toBe(true);
      expect(report.samples[4]?.matched).toBe(false);
      expect(report.samples[5]?.matched).toBe(false);
    });
  });

  describe('Scenario 13: The ReDoS Trap (Password Pattern Backtracking)', () => {
    it('detects nested quantifiers on password input and offers safer linear alternative', () => {
      const dangerousPattern = '^([a-zA-Z0-9]+)*$';
      const risk = checkCatastrophicBacktrackingRisk(dangerousPattern);
      expect(risk.isSafe).toBe(false);
      expect(risk.suggestedAlternative).toBeDefined();

      const report = evaluateRegex(dangerousPattern, '', ['abc123', 'a'.repeat(2000) + '!']);
      expect(report.isSafe).toBe(false);
      expect(report.suggestedAlternative).toBeDefined();
    });
  });

  describe('Scenario 14: The "Just Give Me The Regex" Power User', () => {
    it('respects skip explanation preference and extracts regex literal cleanly', async () => {
      const prompt = `Skip the explanation. Pattern: /^\\d{3}-\\d{2}-\\d{4}$/\nSample: 123-45-6789\nSample: 12-345-6789`;

      const req = new Request('https://regex-bot.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testKey}`,
        },
        body: JSON.stringify({
          version: '1.0.0',
          type: 'query',
          user_id: 'u_power',
          conversation_id: 'c_power',
          message_id: 'm_power',
          query: [{ role: 'user', content: prompt }],
        }),
      });

      const res = await handleRegexWorkerRequest(req, { POE_ACCESS_KEY: testKey });
      const text = await res.text();

      expect(text).toContain('**Pattern**:');
      expect(text).not.toContain('**Description**:');
      expect(text).toContain('123-45-6789');
      expect(text).toContain('Matched');
      expect(text).toContain('12-345-6789');
      expect(text).toContain('No Match');
    });
  });

  describe('Scenario 17 & 18: Disclaimers for Credit Cards & Nested HTML', () => {
    it('provides Luhn checksum disclaimer on credit card format validation', () => {
      const proposal = synthesizePatternFromHeuristics('Match credit card numbers for Visa and Mastercard');
      expect(proposal.pattern).toContain('4[0-9]{12}');
      expect(proposal.explanation).toContain('Luhn algorithm checksum');
      expect(proposal.explanation).toContain('PCI-DSS');
    });

    it('honestly discloses theoretical limitations on nested HTML tags (Chomsky/pumping lemma)', () => {
      const proposal = synthesizePatternFromHeuristics('Match nested html tags <div><p></p></div>');
      expect(proposal.explanation).toContain('Theoretical Limitation');
      expect(proposal.explanation).toContain('context-free grammar');
      expect(proposal.explanation).toContain('DOMParser');
    });

    it('discloses false-positive risks on secret token scanning', () => {
      const proposal = synthesizePatternFromHeuristics('Scan for secrets like AWS access keys and GitHub tokens');
      expect(proposal.pattern).toContain('AKIA');
      expect(proposal.explanation).toContain('Security Notice');
      expect(proposal.explanation).toContain('GitLeaks');
    });
  });
});
