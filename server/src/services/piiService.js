/**
 * Inspects incoming prompts for sensitive information and masks them.
 * @param {string} text - Original prompt
 * @returns {{ sanitizedText: string, piiDetected: boolean, redactedTypes: string[] }}
 */
export function redactPII(text) {
  let piiDetected = false;
  let sanitizedText = text;
  const redactedTypes = [];

  // 1. Email Redaction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  if (emailRegex.test(sanitizedText)) {
    piiDetected = true;
    if (!redactedTypes.includes('EMAIL')) redactedTypes.push('EMAIL');
    sanitizedText = sanitizedText.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  // 2. Credit Card Redaction (basic 13-19 digit detection)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  if (ccRegex.test(sanitizedText)) {
    piiDetected = true;
    if (!redactedTypes.includes('CREDIT_CARD')) redactedTypes.push('CREDIT_CARD');
    sanitizedText = sanitizedText.replace(ccRegex, '[CARD_REDACTED]');
  }

  // 3. API Key / Secrets Redaction (Generic JWT, Bearer tokens, Sk- keys)
  const apiKeyRegex = /(?:sk-[a-zA-Z0-9]{32,}|eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*|Bearer\s+[a-zA-Z0-9\-_]+)/gi;
  if (apiKeyRegex.test(sanitizedText)) {
    piiDetected = true;
    if (!redactedTypes.includes('API_KEY')) redactedTypes.push('API_KEY');
    sanitizedText = sanitizedText.replace(apiKeyRegex, '[API_KEY_REDACTED]');
  }

  // 4. US SSN Redaction
  const ssnRegex = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g;
  if (ssnRegex.test(sanitizedText)) {
    piiDetected = true;
    if (!redactedTypes.includes('SSN')) redactedTypes.push('SSN');
    sanitizedText = sanitizedText.replace(ssnRegex, '[SSN_REDACTED]');
  }

  // 5. Basic Phone Number Redaction (US format)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  if (phoneRegex.test(sanitizedText)) {
    piiDetected = true;
    if (!redactedTypes.includes('PHONE')) redactedTypes.push('PHONE');
    sanitizedText = sanitizedText.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  return { sanitizedText, piiDetected, redactedTypes };
}
