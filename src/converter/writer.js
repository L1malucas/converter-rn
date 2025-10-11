const fs = require('fs-extra');
const path = require('path');

async function writeConvertedFiles(component, outputDir, parsed) {
  const targetDir = outputDir || component.fullPath;
  await fs.ensureDir(targetDir);
  
  const componentFileName = `${component.name}.tsx`;
  const stylesFileName = `${component.name}.styles.ts`;
  
  const componentPath = path.join(targetDir, componentFileName);
  const stylesPath = path.join(targetDir, stylesFileName);
  
  await fs.writeFile(componentPath, parsed.component, 'utf-8');
  await fs.writeFile(stylesPath, parsed.styles, 'utf-8');
  
  return {
    componentPath,
    stylesPath
  };
}

async function savePartialOutput(component, outputDir, content) {
  const targetDir = outputDir || component.fullPath;
  await fs.ensureDir(targetDir);
  
  const partialFileName = `${component.name}.partial.txt`;
  const partialPath = path.join(targetDir, partialFileName);
  
  await fs.writeFile(partialPath, content, 'utf-8');
  
  return partialPath;
}

module.exports = {
  writeConvertedFiles,
  savePartialOutput
};