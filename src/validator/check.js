const { glob } = require('glob');
const fs = require('fs-extra');
const path = require('path');
const { logInfo, logSuccess, logError, logWarning } = require('../utils/logger');
const chalk = require('chalk');

async function validateComponents(baseDir) {
  logInfo('Scanning for converted components...');
  
  const tsxFiles = await glob('**/*.tsx', {
    cwd: baseDir,
    ignore: ['**/node_modules/**', '**/dist/**']
  });

  if (tsxFiles.length === 0) {
    logWarning('No converted components found.');
    return;
  }

  console.log(chalk.cyan(`\nFound ${tsxFiles.length} components to validate\n`));

  const results = [];

  for (const file of tsxFiles) {
    const fullPath = path.join(baseDir, file);
    const result = await validateComponent(fullPath);
    results.push({ file, ...result });
  }

  displayValidationResults(results);
}

async function validateComponent(filePath) {
  const errors = [];
  const warnings = [];
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, '.tsx');
  const stylesFile = path.join(dir, `${baseName}.styles.ts`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (!content.includes('import React') && !content.includes('from \'react\'')) {
      errors.push('Missing React import');
    }

    if (!content.includes('React.FC') && !content.includes(': FC')) {
      warnings.push('Component not typed as React.FC');
    }

    if (!content.match(/export\s+(default|const)/)) {
      errors.push('Missing export statement');
    }

    const hasStyleImport = content.includes('.styles');
    const styleFileExists = await fs.pathExists(stylesFile);

    if (hasStyleImport && !styleFileExists) {
      errors.push('Style file referenced but not found');
    }

    if (!hasStyleImport && styleFileExists) {
      warnings.push('Style file exists but not imported');
    }

    if (styleFileExists) {
      const styleContent = await fs.readFile(stylesFile, 'utf-8');
      
      if (!styleContent.includes('StyleSheet.create')) {
        errors.push('Styles file missing StyleSheet.create');
      }

      if (!styleContent.match(/export\s+(default|const)/)) {
        errors.push('Styles file missing export');
      }
    }

    const syntaxValid = validateSyntax(content);
    if (!syntaxValid) {
      errors.push('Potential syntax errors detected');
    }

  } catch (error) {
    errors.push(`Failed to read file: ${error.message}`);
  }

  return { errors, warnings };
}

function validateSyntax(content) {
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;

  return openBraces === closeBraces && 
         openParens === closeParens && 
         openBrackets === closeBrackets;
}

function displayValidationResults(results) {
  console.log(chalk.bold('\n📋 Validation Results:\n'));

  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach(result => {
    const hasIssues = result.errors.length > 0 || result.warnings.length > 0;
    
    if (!hasIssues) {
      console.log(chalk.green('✓') + ' ' + chalk.gray(result.file));
    } else {
      console.log(chalk.yellow('⚠') + ' ' + chalk.white(result.file));
      
      result.errors.forEach(error => {
        console.log(chalk.red('  ✗ ' + error));
        totalErrors++;
      });
      
      result.warnings.forEach(warning => {
        console.log(chalk.yellow('  ⚠ ' + warning));
        totalWarnings++;
      });
      
      console.log('');
    }
  });

  console.log(chalk.bold('\nSummary:'));
  console.log(chalk.gray(`  Components: ${results.length}`));
  console.log(totalErrors > 0 ? chalk.red(`  Errors: ${totalErrors}`) : chalk.green(`  Errors: 0`));
  console.log(totalWarnings > 0 ? chalk.yellow(`  Warnings: ${totalWarnings}`) : chalk.green(`  Warnings: 0`));
  console.log('');
}

module.exports = { validateComponents };