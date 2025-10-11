const { glob } = require('glob');
const path = require('path');
const fs = require('fs-extra');

async function findComponents(baseDir) {
  const pattern = '**/*.page.ts';
  const files = await glob(pattern, { 
    cwd: baseDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts']
  });

  const components = [];

  for (const file of files) {
    const fullPath = path.join(baseDir, file);
    const dir = path.dirname(fullPath);
    const baseName = path.basename(file, '.page.ts');
    
    const htmlFile = path.join(dir, `${baseName}.page.html`);
    const scssFile = path.join(dir, `${baseName}.page.scss`);
    const tsFile = fullPath;

    if (await fs.pathExists(htmlFile) && await fs.pathExists(tsFile)) {
      components.push({
        name: baseName,
        path: path.relative(baseDir, dir),
        htmlFile,
        scssFile: await fs.pathExists(scssFile) ? scssFile : null,
        tsFile,
        fullPath: dir
      });
    }
  }

  return components;
}

module.exports = { findComponents };