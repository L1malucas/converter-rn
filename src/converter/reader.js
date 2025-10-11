const fs = require('fs-extra');

async function readComponentFiles(component) {
  const html = await fs.readFile(component.htmlFile, 'utf-8');
  const scss = component.scssFile ? await fs.readFile(component.scssFile, 'utf-8') : '';
  const ts = await fs.readFile(component.tsFile, 'utf-8');

  return {
    html,
    scss,
    ts,
    name: component.name
  };
}

module.exports = { readComponentFiles };