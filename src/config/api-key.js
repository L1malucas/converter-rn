const inquirer = require('inquirer');
const CryptoJS = require('crypto-js');
const { loadConfig, updateConfig } = require('./manager');
const { logSuccess, logWarning } = require('../utils/logger');

const ENCRYPTION_KEY = 'converter-rn-secret-key-v1';

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
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