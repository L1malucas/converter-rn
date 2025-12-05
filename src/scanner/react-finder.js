const { glob } = require('glob');
const path = require('path');
const fs = require('fs-extra');

async function findReactComponents(baseDir) {
  const patterns = ['**/*.tsx', '**/*.jsx'];
  const allFiles = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd: baseDir,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/out/**',
        '**/*.test.tsx',
        '**/*.test.jsx',
        '**/*.spec.tsx',
        '**/*.spec.jsx',
        '**/*.stories.tsx',
        '**/*.stories.jsx'
      ]
    });
    allFiles.push(...files);
  }

  const components = [];

  for (const file of allFiles) {
    const fullPath = path.join(baseDir, file);
    const dir = path.dirname(fullPath);
    const fileName = path.basename(file);
    const baseName = path.basename(file, path.extname(file));
    const extension = path.extname(file);

    const content = await fs.readFile(fullPath, 'utf-8');

    if (isReactComponent(content)) {
      components.push({
        name: baseName,
        fileName,
        path: path.relative(baseDir, dir),
        tsxFile: fullPath,
        fullPath: dir,
        extension,
        isTypeScript: extension === '.tsx'
      });
    }
  }

  return components;
}

function isReactComponent(content) {
  const hasReactImport = /import\s+.*React.*from\s+['"]react['"]/.test(content) ||
                         /import\s+\{[^}]*\}\s+from\s+['"]react['"]/.test(content);

  const hasJSXReturn = /<[A-Z][\w]*/.test(content) ||
                       /return\s*\(?\s*</.test(content) ||
                       /=>\s*\(?\s*</.test(content);

  const hasFunctionComponent = /export\s+(default\s+)?function\s+[A-Z]/.test(content) ||
                               /const\s+[A-Z][\w]*\s*[:=]\s*\(/.test(content) ||
                               /export\s+const\s+[A-Z][\w]*\s*[:=]\s*\(/.test(content);

  const hasClassComponent = /class\s+[A-Z][\w]*\s+extends\s+(React\.)?Component/.test(content) ||
                            /class\s+[A-Z][\w]*\s+extends\s+(React\.)?PureComponent/.test(content);

  return (hasReactImport || hasJSXReturn) && (hasFunctionComponent || hasClassComponent || hasJSXReturn);
}

module.exports = { findReactComponents };
