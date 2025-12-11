const fs = require('fs-extra');
const path = require('path');
const { validateOutputDirectory, sanitizeComponentName } = require('../utils/path-validator');

async function writeConvertedFiles(component, outputDir, parsed) {
  // Validate and sanitize inputs
  const targetDir = outputDir || component.fullPath;
  const validatedDir = validateOutputDirectory(targetDir);
  const safeName = sanitizeComponentName(component.name);

  await fs.ensureDir(validatedDir);

  const componentFileName = `${safeName}.tsx`;
  const stylesFileName = `${safeName}.styles.ts`;

  const componentPath = path.join(validatedDir, componentFileName);
  const stylesPath = path.join(validatedDir, stylesFileName);

  await fs.writeFile(componentPath, parsed.component, 'utf-8');
  await fs.writeFile(stylesPath, parsed.styles, 'utf-8');

  return {
    componentPath,
    stylesPath
  };
}

async function savePartialOutput(component, outputDir, content) {
  // Validate and sanitize inputs
  const targetDir = outputDir || component.fullPath;
  const validatedDir = validateOutputDirectory(targetDir);
  const safeName = sanitizeComponentName(component.name);

  await fs.ensureDir(validatedDir);

  const partialFileName = `${safeName}.partial.txt`;
  const partialPath = path.join(validatedDir, partialFileName);

  await fs.writeFile(partialPath, content, 'utf-8');

  return partialPath;
}

module.exports = {
  writeConvertedFiles,
  savePartialOutput
};