const fs = require('fs-extra');
const path = require('path');
const { validateOutputDirectory, sanitizeComponentName } = require('../utils/path-validator');

async function writeAngularFiles(component, outputDir, parsed) {
  // Validate and sanitize inputs
  const targetDir = outputDir || component.fullPath;
  const validatedDir = validateOutputDirectory(targetDir);
  const safeName = sanitizeComponentName(component.name);

  await fs.ensureDir(validatedDir);

  const componentFileName = `${toKebabCase(safeName)}.component.ts`;
  const templateFileName = `${toKebabCase(safeName)}.component.html`;

  const componentPath = path.join(validatedDir, componentFileName);
  const templatePath = path.join(validatedDir, templateFileName);

  await fs.writeFile(componentPath, parsed.component, 'utf-8');
  await fs.writeFile(templatePath, parsed.template, 'utf-8');

  return {
    componentPath,
    templatePath
  };
}

async function savePartialAngularOutput(component, outputDir, content) {
  // Validate and sanitize inputs
  const targetDir = outputDir || component.fullPath;
  const validatedDir = validateOutputDirectory(targetDir);
  const safeName = sanitizeComponentName(component.name);

  await fs.ensureDir(validatedDir);

  const partialFileName = `${toKebabCase(safeName)}.partial.txt`;
  const partialPath = path.join(validatedDir, partialFileName);

  await fs.writeFile(partialPath, content, 'utf-8');

  return partialPath;
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

module.exports = {
  writeAngularFiles,
  savePartialAngularOutput
};
