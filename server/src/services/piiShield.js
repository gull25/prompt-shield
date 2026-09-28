// PII Shield implementation
// Redacts Emails, Credit Cards, API Keys, SSNs, and phone numbers

export function redactPII(text) {
  let piiDetected = false;
  let sanitized = text;

  // 1. Email Redaction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  if (emailRegex.test(sanitized)) {
    piiDetected = true;
    sanitized = sanitized.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  // 2. Credit Card Redaction (basic 13-19 digit detection, can add Luhn check if needed)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  if (ccRegex.test(sanitized)) {
    piiDetected = true;
    sanitized = sanitized.replace(ccRegex, '[CARD_REDACTED]');
  }

  // 3. API Key / Secrets Redaction (Generic JWT, Bearer tokens, Sk- keys)
  const apiKeyRegex = /(?:sk-[a-zA-Z0-9]{32,}|eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*|Bearer\s+[a-zA-Z0-9\-_]+)/gi;
  if (apiKeyRegex.test(sanitized)) {
    piiDetected = true;
    sanitized = sanitized.replace(apiKeyRegex, '[API_KEY_REDACTED]');
  }

  // 4. US SSN Redaction
  const ssnRegex = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g;
  if (ssnRegex.test(sanitized)) {
    piiDetected = true;
    sanitized = sanitized.replace(ssnRegex, '[SSN_REDACTED]');
  }

  // 5. Basic Phone Number Redaction (US format)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  if (phoneRegex.test(sanitized)) {
    piiDetected = true;
    sanitized = sanitized.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  return { sanitized, piiDetected };
}
