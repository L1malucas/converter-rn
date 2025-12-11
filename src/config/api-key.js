const inquirer = require('inquirer');
const CryptoJS = require('crypto-js');
const os = require('os');
const { loadConfig, updateConfig } = require('./manager');
const { logSuccess, logWarning, logInfo } = require('../utils/logger');

/**
 * Get encryption key from environment variable or generate from machine-specific data
 * Priority:
 * 1. CONVERTER_RN_ENCRYPTION_KEY environment variable (most secure)
 * 2. Machine-specific key based on hostname (better than hardcoded)
 */
function getEncryptionKey() {
  // Try to get from environment variable first
  if (process.env.CONVERTER_RN_ENCRYPTION_KEY) {
    return process.env.CONVERTER_RN_ENCRYPTION_KEY;
  }

  // Fallback: Generate from machine-specific data
  // This is better than a hardcoded key but still has limitations
  const hostname = os.hostname();
  const platform = os.platform();
  return CryptoJS.SHA256(`converter-rn-${hostname}-${platform}-v2`).toString();
}

function encrypt(text) {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(text, key).toString();
}

function decrypt(encryptedText) {
  const key = getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function checkApiKey() {
  const config = await loadConfig();

  if (!config.geminiApiKey) {
    logWarning('No Gemini API key found.');
    await saveApiKey();
    return;
  }

  const { useExisting } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useExisting',
      message: 'Use existing Gemini API key?',
      default: true
    }
  ]);

  if (!useExisting) {
    await saveApiKey(true);
  }
}

async function saveApiKey(isUpdate = false) {
  // Show security warning on first save
  if (!isUpdate && !process.env.CONVERTER_RN_ENCRYPTION_KEY) {
    logWarning('\nSecurity Notice:');
    logInfo('  Your API key will be encrypted and stored locally.');
    logInfo('  For enhanced security, set the CONVERTER_RN_ENCRYPTION_KEY environment variable.');
    logInfo('  Example: export CONVERTER_RN_ENCRYPTION_KEY="your-secret-key"\n');
  }

  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: isUpdate ? 'Enter new Gemini API key:' : 'Enter your Gemini API key:',
      mask: '*',
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return 'API key cannot be empty';
        }
        return true;
      }
    }
  ]);

  const encryptedKey = encrypt(apiKey.trim());
  await updateConfig({ geminiApiKey: encryptedKey });
  logSuccess('API key saved successfully!');
}

async function getApiKey() {
  const config = await loadConfig();

  if (!config.geminiApiKey) {
    throw new Error('No API key configured');
  }

  return decrypt(config.geminiApiKey);
}

module.exports = {
  checkApiKey,
  saveApiKey,
  getApiKey
};