const { loadConfig } = require('../config/manager');
const fs = require('fs-extra');
const path = require('path');
const { sanitizeCodeContent, sanitizeComponentName } = require('../utils/prompt-sanitizer');

async function buildPrompt(files) {
  const config = await loadConfig();
  const templatePath = path.join(__dirname, '../../templates/conversion-prompt.txt');
  const styleGuidePath = path.join(__dirname, '../../templates/style-guide.txt');

  let template = await fs.readFile(templatePath, 'utf-8');
  const styleGuide = await fs.readFile(styleGuidePath, 'utf-8');

  const componentMappings = Object.entries(config.componentMappings)
    .map(([ionic, rn]) => `${ionic} → ${rn}`)
    .join('\n');

  const dependencyMappings = Object.entries(config.dependencyMappings)
    .map(([angular, rn]) => `${angular} → ${rn}`)
    .join('\n');

  const iconLibrary = config.icons.library;
  const iconMappings = Object.entries(config.icons.mappings)
    .map(([ionic, rn]) => `${ionic} → ${rn}`)
    .join('\n');

  // Sanitize user-provided code to prevent prompt injection
  const sanitizedHtml = sanitizeCodeContent(files.html, 'html');
  const sanitizedScss = sanitizeCodeContent(files.scss, 'scss');
  const sanitizedTs = sanitizeCodeContent(files.ts, 'typescript');
  const sanitizedName = sanitizeComponentName(files.name);

  template = template
    .replace('{{COMPONENT_MAPPINGS}}', componentMappings)
    .replace('{{DEPENDENCY_MAPPINGS}}', dependencyMappings)
    .replace('{{ICON_LIBRARY}}', iconLibrary)
    .replace('{{ICON_MAPPINGS}}', iconMappings)
    .replace('{{STYLE_GUIDE}}', styleGuide)
    .replace('{{HTML_CONTENT}}', sanitizedHtml)
    .replace('{{SCSS_CONTENT}}', sanitizedScss)
    .replace('{{TS_CONTENT}}', sanitizedTs)
    .replace('{{COMPONENT_NAME}}', sanitizedName);

  return template;
}

module.exports = { buildPrompt };