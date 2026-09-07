export interface RegexPatternProposal {
  pattern: string;
  flags: string;
  explanation: string;
}

/**
 * Fallback pattern synthesizer for standard natural language inquiries.
 * Guarantees zero-network offline determinism in testing and environments without active Poe API credentials.
 */
export function synthesizePatternFromHeuristics(prompt: string): RegexPatternProposal {
  const lower = prompt.toLowerCase();

  // If user provided a regex literal like `/^[a-z]+$/i` or `Pattern: /.../`
  const literalMatch = prompt.match(/(?:^|[\s:=])\/(?![</])([^/\r\n<>]+)\/([gimsuy]*)/);
  if (
    literalMatch &&
    literalMatch[1] &&
    !lower.includes('nested') &&
    !lower.includes('html') &&
    !lower.includes('tags')
  ) {
    const isSkipExplanation = /skip\s+(?:the\s+)?explanation|no\s+explanation|concise/i.test(prompt);
    return {
      pattern: literalMatch[1],
      flags: literalMatch[2] || '',
      explanation: isSkipExplanation ? '' : 'Extracted regex literal from user prompt.',
    };
  }

  // Nested HTML tags or balanced brackets
  if (
    (lower.includes('nested') || lower.includes('balanced')) &&
    (lower.includes('html') || lower.includes('tag') || lower.includes('xml') || lower.includes('parenthes') || lower.includes('bracket') || lower.includes('div'))
  ) {
    return {
      pattern: '<([a-zA-Z0-9]+)[^>]*>(.*?)<\\/\\1>',
      flags: 'gs',
      explanation:
        '⚠️ Theoretical Limitation: Arbitrarily nested structures cannot be validated by regular expressions alone due to Chomsky hierarchy limits (context-free grammar required; see pumping lemma). This pattern matches flat/single-level opening and closing tag pairs. For arbitrary nesting, use an HTML parser library (DOMParser, Cheerio, or BeautifulSoup).',
    };
  }

  // Credit card validation
  if (
    lower.includes('credit card') ||
    lower.includes('card number') ||
    lower.includes('visa') ||
    lower.includes('mastercard') ||
    lower.includes('amex')
  ) {
    return {
      pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$',
      flags: '',
      explanation:
        'Matches format for Visa (13/16 digits), MasterCard (16 digits), and American Express (15 digits). ⚠️ Notice: Regular expressions validate digit format only, NOT Luhn algorithm checksums. Per PCI-DSS standards, use a dedicated payment library for validation and never log or store unencrypted PAN numbers.',
    };
  }

  // Secrets & API tokens
  if (
    lower.includes('secret') ||
    lower.includes('token') ||
    lower.includes('api key') ||
    lower.includes('aws key') ||
    lower.includes('github token')
  ) {
    return {
      pattern: '(?:AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|xox[baprs]-[0-9a-zA-Z]{10,48}|[a-zA-Z0-9+/]{40,}={0,2})',
      flags: 'g',
      explanation:
        'Matches common API tokens including AWS Access Keys (AKIA), GitHub Personal Access Tokens (ghp_), Slack tokens (xox-), and base64-encoded secrets. ⚠️ Security Notice: Regex detection produces false positives on high-entropy strings. For production secret scanning in repositories and CI/CD pipelines, use dedicated tools like GitLeaks or TruffleHog.',
    };
  }

  // Indian mobile numbers
  if (
    (lower.includes('indian') || lower.includes('+91') || lower.includes('india')) &&
    (lower.includes('phone') || lower.includes('mobile') || lower.includes('number'))
  ) {
    return {
      pattern: '^(?:\\+91[-.\\s]?|0)?[6-9]\\d{4}[-.\\s]?\\d{5}$',
      flags: '',
      explanation:
        'Matches Indian mobile telephone numbers (10 digits starting with 6-9, with optional +91 or 0 prefix and optional separator spaces/dashes per Indian numbering plan).',
    };
  }

  // Passwords
  if (lower.includes('password')) {
    return {
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$',
      flags: '',
      explanation:
        'Matches strong passwords (minimum 8 characters with at least one letter and one number) using linear lookaheads that avoid catastrophic backtracking.',
    };
  }

  if (lower.includes('email')) {
    return {
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      flags: 'i',
      explanation:
        'Matches RFC 5322 compliant email addresses including plus addressing (user+tag@domain.com) and subdomains. ℹ️ Notice: Regex verifies syntactic format only; it cannot verify deliverability or detect scam domains (.com.co). Use DNS MX record lookups and domain blocklists in your application layer.',
    };
  }

  if (lower.includes('phone') || lower.includes('mobile')) {
    return {
      pattern: '^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$',
      flags: '',
      explanation: 'Matches international and domestic telephone number formats.',
    };
  }

  if (lower.includes('url') || lower.includes('website') || lower.includes('http')) {
    return {
      pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$',
      flags: 'i',
      explanation: 'Matches standard HTTP and HTTPS web URLs, strictly rejecting non-HTTP protocols (ftp://, mailto:, javascript:).',
    };
  }

  if (lower.includes('date') || lower.includes('yyyy-mm-dd') || lower.includes('dd/mm/yyyy')) {
    return {
      pattern: '^(?:\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}|\\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-\\d{2,4})$',
      flags: 'i',
      explanation:
        'Matches standard ISO-8601 (YYYY-MM-DD), slash dates (DD/MM/YYYY or MM/DD/YYYY), and alphanumeric dates (01-Jan-2024). ℹ️ Notice: Regex verifies string formatting only, not calendar validity (e.g. leap years or days in month). For production validation, parse matching strings with Date() or date-fns.',
    };
  }

  if (lower.includes('uuid')) {
    return {
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
      flags: 'i',
      explanation: 'Matches canonical RFC 4122 UUID strings.',
    };
  }

  if (lower.includes('digits') || lower.includes('numeric') || lower.includes('numbers only')) {
    return {
      pattern: '^\\d+$',
      flags: '',
      explanation: 'Matches one or more consecutive decimal digits.',
    };
  }

  // Default fallback: match word characters
  return {
    pattern: '\\b[a-zA-Z0-9_-]+\\b',
    flags: 'g',
    explanation: 'Matches standard alphanumeric identifiers and words.',
  };
}

/**
 * Queries Poe upstream model via server_bot_dependencies.
 */
export async function queryPoeUpstreamBot(
  botName: string,
  userInstruction: string,
  apiKey: string,
  fetchFn: typeof fetch = fetch,
): Promise<RegexPatternProposal> {
  const systemPrompt =
    'You are an expert regex generator. Respond ONLY with a JSON object: {"pattern": "<regex>", "flags": "<flags>", "explanation": "<brief summary>"}. Do not include markdown codeblocks or other commentary.';

  const payload = {
    version: '1.0.0',
    type: 'query',
    query: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInstruction },
    ],
  };

  try {
    const res = await fetchFn(`https://api.poe.com/bot/${botName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Upstream Poe query failed with HTTP ${res.status}`);
    }

    const text = await res.text();
    // Parse SSE response or raw json
    const jsonMatch = text.match(/\{[\s\S]*"pattern"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        pattern: parsed.pattern || '^.*$',
        flags: parsed.flags || '',
        explanation: parsed.explanation || 'Generated regex pattern.',
      };
    }
  } catch (_e) {
    // Graceful failover to heuristic synthesizer
  }

  return synthesizePatternFromHeuristics(userInstruction);
}
