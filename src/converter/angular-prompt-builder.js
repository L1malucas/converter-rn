const fs = require('fs-extra');
const path = require('path');
const reactMappings = require('../config/react-to-angular-mappings');

async function buildAngularPrompt(files) {
  const templatePath = path.join(__dirname, '../../templates/react-to-angular-prompt.txt');
  const styleGuidePath = path.join(__dirname, '../../templates/angular-style-guide.txt');

  let template = await fs.readFile(templatePath, 'utf-8');
  const styleGuide = await fs.readFile(styleGuidePath, 'utf-8');

  const componentMappings = Object.entries(reactMappings.components)
    .map(([react, angular]) => `${react} → ${angular}`)
    .join('\n');

  const hooksMappings = Object.entries(reactMappings.hooks)
    .map(([react, angular]) => `${react} → ${angular}`)
    .join('\n');

  const eventMappings = Object.entries(reactMappings.events)
    .map(([react, angular]) => `${react} → ${angular}`)
    .join('\n');

  const attributeMappings = Object.entries(reactMappings.attributes)
    .map(([react, angular]) => `${react} → ${angular}`)
    .join('\n');

  template = template
    .replace('{{STYLE_GUIDE}}', styleGuide)
    .replace('{{COMPONENT_MAPPINGS}}', componentMappings)
    .replace('{{HOOKS_MAPPINGS}}', hooksMappings)
    .replace('{{EVENT_MAPPINGS}}', eventMappings)
    .replace('{{ATTRIBUTE_MAPPINGS}}', attributeMappings)
    .replace('{{COMPONENT_NAME}}', files.name)
    .replace('{{TSX_CONTENT}}', files.tsx);

  return template;
}

module.exports = { buildAngularPrompt };
