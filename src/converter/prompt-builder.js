const { loadConfig } = require('../config/manager');
const fs = require('fs-extra');
const path = require('path');

async function buildPrompt(files) {
  const config = await loadConfig();
  const templatePath = path.join(__dirname, '../../templates/conversion-prompt.txt');
  const styleGuidePath = path.join(__dirname, '../../templates/style-guide.txt');
  
  let template = await fs.readFile(templatePath, 'utf-8');
  const styleGuide = await fs.readFile(styleGuidePath, 'utf-8');

  const mappings = Object.entries(config.componentMappings)
    .map(([ionic, rn]) => `${ionic} → ${rn}`)
    .join('\n');

  const dependencies = Object.entries(config.dependencyMappings)
    .map(([angular, rn]) => `${angular} → ${rn}`)
    .join('\n');

  template = template
    .replace('{{COMPONENT_MAPPINGS}}', mappings)
    .replace('{{DEPENDENCY_MAPPINGS}}', dependencies)
    .replace('{{STYLE_GUIDE}}', styleGuide)
    .replace('{{HTML_CONTENT}}', files.html)
    .replace('{{SCSS_CONTENT}}', files.scss)
    .replace('{{TS_CONTENT}}', files.ts)
    .replace('{{COMPONENT_NAME}}', files.name);

  return template;
}

module.exports = { buildPrompt };