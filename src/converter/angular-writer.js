const fs = require('fs-extra');
const path = require('path');

async function writeAngularFiles(component, outputDir, parsed) {
  const targetDir = outputDir || component.fullPath;
  await fs.ensureDir(targetDir);

  const componentFileName = `${toKebabCase(component.name)}.component.ts`;
  const templateFileName = `${toKebabCase(component.name)}.component.html`;

  const componentPath = path.join(targetDir, componentFileName);
  const templatePath = path.join(targetDir, templateFileName);

  await fs.writeFile(componentPath, parsed.component, 'utf-8');
  await fs.writeFile(templatePath, parsed.template, 'utf-8');

  return {
    componentPath,
    templatePath
  };
}

async function savePartialAngularOutput(component, outputDir, content) {
  const targetDir = outputDir || component.fullPath;
  await fs.ensureDir(targetDir);

  const partialFileName = `${toKebabCase(component.name)}.partial.txt`;
  const partialPath = path.join(targetDir, partialFileName);

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
