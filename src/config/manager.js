const fs = require('fs-extra');
const path = require('path');
const defaultMappings = require('./default-mappings');

const CONFIG_FILE = '.converter-rn.config.json';

const DEFAULT_CONFIG = {
  geminiApiKey: null,
  outputDir: './converted',
  outputMode: 'same-directory',
  componentMappings: defaultMappings.components,
  dependencyMappings: defaultMappings.dependencies,
  icons: defaultMappings.icons,
  styleStrategy: 'separate-file',
  codeStyle: {
    interfacePrefix: 'I',
    componentType: 'React.FC',
    strictMode: true
  }
};

async function initConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (!await fs.pathExists(configPath)) {
    await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
  }
}

async function loadConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (!await fs.pathExists(configPath)) {
    return DEFAULT_CONFIG;
  }

  return await fs.readJson(configPath);
}

async function updateConfig(updates) {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  const currentConfig = await loadConfig();
  const newConfig = { ...currentConfig, ...updates };
  await fs.writeJson(configPath, newConfig, { spaces: 2 });
}

module.exports = {
  initConfig,
  loadConfig,
  updateConfig
};