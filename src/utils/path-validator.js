const path = require('path');
const { logError } = require('./logger');

/**
 * Validates that a user-provided path doesn't contain path traversal sequences
 * and stays within the allowed base directory
 *
 * @param {string} basePath - The base directory that all paths must stay within
 * @param {string} userPath - The user-provided path to validate
 * @returns {string} The validated absolute path
 * @throws {Error} If path traversal is detected
 */
function validatePath(basePath, userPath) {
  // Resolve both paths to absolute paths
  const resolvedBase = path.resolve(basePath);
  const resolvedUser = path.resolve(basePath, userPath);

  // Normalize to handle different path separators and .. sequences
  const normalizedBase = path.normalize(resolvedBase);
  const normalizedUser = path.normalize(resolvedUser);

  // Check if the user path is within the base path
  if (!normalizedUser.startsWith(normalizedBase)) {
    logError(`Path traversal detected: ${userPath}`);
    throw new Error('Invalid path: Path traversal detected. Path must be within the project directory.');
  }

  return normalizedUser;
}

/**
 * Sanitizes a component name to ensure it only contains safe characters
 * Removes any path separators and special characters
 *
 * @param {string} name - The component name to sanitize
 * @returns {string} The sanitized component name
 */
function sanitizeComponentName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Component name must be a non-empty string');
  }

  // Remove path separators, null bytes, and other dangerous characters
  // Allow only alphanumeric, hyphens, underscores, and dots
  const sanitized = name.replace(/[^a-zA-Z0-9._-]/g, '');

  // Ensure the name isn't empty after sanitization
  if (sanitized.length === 0) {
    throw new Error('Component name contains no valid characters');
  }

  // Prevent names that are just dots (like .. or .)
  if (/^\.+$/.test(sanitized)) {
    throw new Error('Invalid component name: cannot be only dots');
  }

  return sanitized;
}

/**
 * Validates a directory path for output operations
 * Ensures the path is safe and within the current working directory
 *
 * @param {string} outputDir - The output directory to validate
 * @returns {string} The validated absolute path
 */
function validateOutputDirectory(outputDir) {
  const cwd = process.cwd();
  return validatePath(cwd, outputDir);
}

module.exports = {
  validatePath,
  sanitizeComponentName,
  validateOutputDirectory
};
