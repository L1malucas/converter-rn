const fs = require('fs-extra');

async function readReactComponentFile(component) {
  try {
    const tsxContent = await fs.readFile(component.tsxFile, 'utf-8');

    return {
      name: component.name,
      tsx: tsxContent,
      isTypeScript: component.isTypeScript
    };
  } catch (error) {
    throw new Error(`Failed to read React component files: ${error.message}`);
  }
}

module.exports = { readReactComponentFile };
