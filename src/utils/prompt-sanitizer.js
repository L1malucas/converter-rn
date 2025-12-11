const { logWarning } = require('./logger');

/**
 * Markers that should not appear in user code to prevent prompt injection
 */
const FORBIDDEN_MARKERS = [
  '===COMPONENT===',
  '===STYLES===',
  '===TEMPLATE===',
  '{{HTML_CONTENT}}',
  '{{SCSS_CONTENT}}',
  '{{TS_CONTENT}}',
  '{{TSX_CONTENT}}',
  '{{COMPONENT_NAME}}',
  '{{COMPONENT_MAPPINGS}}',
  '{{DEPENDENCY_MAPPINGS}}'
];

/**
 * Patterns that might indicate prompt injection attempts
 */
const SUSPICIOUS_PATTERNS = [
  /IGNORE\s+(ALL\s+)?PREVIOUS\s+INSTRUCTIONS/i,
  /DISREGARD\s+(ALL\s+)?PREVIOUS\s+INSTRUCTIONS/i,
  /FORGET\s+(ALL\s+)?PREVIOUS\s+INSTRUCTIONS/i,
  /NEW\s+INSTRUCTIONS?:/i,
  /SYSTEM\s+PROMPT:/i,
  /INSTEAD,?\s+(DO|PERFORM|EXECUTE)/i
];

/**
 * Sanitizes user-provided code content to prevent prompt injection
 *
 * @param {string} content - The code content to sanitize
 * @param {string} contentType - Type of content (html, css, typescript, etc.)
 * @returns {string} Sanitized content with safety markers
 */
function sanitizeCodeContent(content, contentType = 'code') {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Check for forbidden markers
  const foundMarkers = FORBIDDEN_MARKERS.filter(marker =>
    content.includes(marker)
  );

  if (foundMarkers.length > 0) {
    logWarning(`Warning: Suspicious markers found in ${contentType}: ${foundMarkers.join(', ')}`);
    logWarning('These markers will be escaped to prevent prompt injection.');

    // Escape forbidden markers
    foundMarkers.forEach(marker => {
      const escaped = `[ESCAPED:${marker}]`;
      content = content.split(marker).join(escaped);
    });
  }

  // Check for suspicious patterns
  const foundPatterns = SUSPICIOUS_PATTERNS.filter(pattern =>
    pattern.test(content)
  );

  if (foundPatterns.length > 0) {
    logWarning(`Warning: Suspicious instruction patterns detected in ${contentType}.`);
    logWarning('The code contains patterns that might be attempting prompt injection.');
  }

  // Wrap content in clear delimiters
  return wrapInSafeDelimiters(content, contentType);
}

/**
 * Wraps content in XML-style delimiters to clearly separate it from instructions
 *
 * @param {string} content - The content to wrap
 * @param {string} contentType - Type of content
 * @returns {string} Wrapped content
 */
function wrapInSafeDelimiters(content, contentType) {
  return `<USER_CODE type="${contentType}">
${content}
</USER_CODE>`;
}

/**
 * Validates that the AI response contains the expected markers
 *
 * @param {string} response - The AI response to validate
 * @param {Array<string>} expectedMarkers - Markers that should be present
 * @returns {boolean} Whether the response is valid
 */
function validateAIResponse(response, expectedMarkers) {
  if (!response || typeof response !== 'string') {
    return false;
  }

  // Check that all expected markers are present
  for (const marker of expectedMarkers) {
    if (!response.includes(marker)) {
      logWarning(`Warning: Expected marker '${marker}' not found in AI response.`);
      return false;
    }
  }

  // Check that markers appear in correct order
  let lastIndex = -1;
  for (const marker of expectedMarkers) {
    const index = response.indexOf(marker);
    if (index <= lastIndex) {
      logWarning('Warning: Markers appear in incorrect order in AI response.');
      return false;
    }
    lastIndex = index;
  }

  return true;
}

/**
 * Sanitizes component name to prevent injection through naming
 *
 * @param {string} name - Component name
 * @returns {string} Sanitized name
 */
function sanitizeComponentName(name) {
  if (!name || typeof name !== 'string') {
    return 'Component';
  }

  // Remove any attempts to inject through the name
  FORBIDDEN_MARKERS.forEach(marker => {
    name = name.split(marker).join('');
  });

  return name.trim();
}

module.exports = {
  sanitizeCodeContent,
  validateAIResponse,
  sanitizeComponentName,
  FORBIDDEN_MARKERS,
  SUSPICIOUS_PATTERNS
};
