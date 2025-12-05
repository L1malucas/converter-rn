const { glob } = require('glob');
const fs = require('fs-extra');
const path = require('path');
const { logInfo, logSuccess, logError, logWarning } = require('../utils/logger');
const chalk = require('chalk');

async function validateAngularComponents(baseDir) {
  logInfo('Scanning for converted Angular components...');

  const componentFiles = await glob('**/*.component.ts', {
    cwd: baseDir,
    ignore: ['**/node_modules/**', '**/dist/**']
  });

  if (componentFiles.length === 0) {
    logWarning('No converted Angular components found.');
    return;
  }

  console.log(chalk.cyan(`\nFound ${componentFiles.length} components to validate\n`));

  const results = [];

  for (const file of componentFiles) {
    const fullPath = path.join(baseDir, file);
    const result = await validateAngularComponent(fullPath);
    results.push({ file, ...result });
  }

  displayAngularValidationResults(results);
}

async function validateAngularComponent(filePath) {
  const errors = [];
  const warnings = [];
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, '.component.ts');
  const templateFile = path.join(dir, `${baseName}.component.html`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (!content.includes('@Component')) {
      errors.push('Missing @Component decorator');
    }

    if (!content.includes('standalone: true')) {
      errors.push('Component is not standalone (Angular 19+ requirement)');
    }

    if (!content.includes('selector:')) {
      errors.push('Missing component selector');
    }

    if (content.includes('*ngIf') || content.includes('*ngFor') || content.includes('*ngSwitch')) {
      errors.push('Using old control flow syntax (*ngIf, *ngFor). Use @if, @for, @switch instead');
    }

    const hasModernControlFlow = content.includes('@if') || content.includes('@for') ||
                                   content.includes('@switch');
    const hasTemplateUrl = content.includes('templateUrl:');

    if (hasTemplateUrl) {
      const templateFileExists = await fs.pathExists(templateFile);
      if (!templateFileExists) {
        errors.push('Template file referenced but not found');
      } else {
        const templateContent = await fs.readFile(templateFile, 'utf-8');

        if (templateContent.includes('*ngIf') || templateContent.includes('*ngFor') ||
            templateContent.includes('*ngSwitch')) {
          errors.push('Template uses old control flow syntax. Use @if, @for, @switch');
        }
      }
    }

    if (!content.includes('export class')) {
      errors.push('Missing component class export');
    }

    if (content.includes(': any') || content.includes('<any>') || content.includes('any[]')) {
      errors.push('Using "any" type - TypeScript should be strictly typed');
    }

    if (content.includes('constructor(') && !content.includes('inject(')) {
      warnings.push('Using constructor injection instead of inject() function');
    }

    const hasSignals = content.includes('signal(') || content.includes('Signal<');
    if (!hasSignals) {
      warnings.push('Not using signals for state management (Angular 19+ best practice)');
    }

    const hasInput = content.includes('input<') || content.includes('input.required<');
    const hasOldInput = content.includes('@Input()');
    if (hasOldInput && !hasInput) {
      warnings.push('Using old @Input() decorator instead of input() function');
    }

    const hasOutput = content.includes('output<');
    const hasOldOutput = content.includes('@Output()');
    if (hasOldOutput && !hasOutput) {
      warnings.push('Using old @Output() decorator instead of output() function');
    }

    const syntaxValid = validateTypeScriptSyntax(content);
    if (!syntaxValid) {
      errors.push('Potential syntax errors detected (unbalanced brackets)');
    }

  } catch (error) {
    errors.push(`Failed to read file: ${error.message}`);
  }

  return { errors, warnings };
}

function validateTypeScriptSyntax(content) {
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

function displayAngularValidationResults(results) {
  console.log(chalk.bold('\nValidation Results:\n'));

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

module.exports = { validateAngularComponents };
