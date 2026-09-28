import { redactPII } from './piiShield.js';

function runTests() {
  console.log('Running PII Shield Tests...\n');
  let passed = 0;
  let failed = 0;

  const testCases = [
    {
      name: 'Email Redaction',
      input: 'My email is test.user@example.com, please contact me.',
      expectedOutput: 'My email is [EMAIL_REDACTED], please contact me.',
      expectedPii: true
    },
    {
      name: 'Credit Card Redaction',
      input: 'Here is my card: 4111 1111 1111 1111 for the payment.',
      expectedOutput: 'Here is my card: [CARD_REDACTED] for the payment.',
      expectedPii: true
    },
    {
      name: 'API Key Redaction',
      input: 'Do not share this: sk-1234567890abcdef1234567890abcdef1234567890',
      expectedOutput: 'Do not share this: [API_KEY_REDACTED]',
      expectedPii: true
    },
    {
      name: 'SSN Redaction',
      input: 'My social security number is 123-45-6789.',
      expectedOutput: 'My social security number is [SSN_REDACTED].',
      expectedPii: true
    },
    {
      name: 'Phone Number Redaction',
      input: 'Call me at (555) 123-4567 tomorrow.',
      expectedOutput: 'Call me at [PHONE_REDACTED] tomorrow.',
      expectedPii: true
    },
    {
      name: 'Clean Prompt',
      input: 'How do I reset my password?',
      expectedOutput: 'How do I reset my password?',
      expectedPii: false
    }
  ];

  testCases.forEach((tc) => {
    const result = redactPII(tc.input);
    const outputMatch = result.sanitized === tc.expectedOutput;
    const piiMatch = result.piiDetected === tc.expectedPii;

    if (outputMatch && piiMatch) {
      console.log(`[PASS] ${tc.name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${tc.name}`);
      console.error(`  Expected Output: ${tc.expectedOutput}`);
      console.error(`  Actual Output:   ${result.sanitized}`);
      console.error(`  Expected PII:    ${tc.expectedPii}`);
      console.error(`  Actual PII:      ${result.piiDetected}`);
      failed++;
    }
  });

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
}

runTests();
