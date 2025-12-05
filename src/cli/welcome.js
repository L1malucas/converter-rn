const chalk = require('chalk');
const os = require('os');
const path = require('path');

function showWelcome() {
  console.clear();

  console.log(chalk.cyan.bold('\n  ╔════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('  ║                                                                ║'));
  console.log(chalk.cyan.bold('  ║                     FRAMEWORK CONVERTER                        ║'));
  console.log(chalk.cyan.bold('  ║                    converter-rn v1.0.2                          ║'));
  console.log(chalk.cyan.bold('  ║                                                                ║'));
  console.log(chalk.cyan.bold('  ╚════════════════════════════════════════════════════════════════╝'));

  console.log(chalk.white('\n  AI-powered component conversion between frameworks\n'));

  console.log(chalk.cyan('  ─────────────────────────────────────────────────────────────────\n'));

  console.log(chalk.gray('  Supported Conversions:'));
  console.log(chalk.green('    ✓ Ionic/Angular to React Native/Expo'));
  console.log(chalk.green('    ✓ React with Tailwind to Angular 19+\n'));

  console.log(chalk.cyan('  ─────────────────────────────────────────────────────────────────\n'));

  const nodeVersion = process.version;
  const platform = os.platform();
  const currentDir = path.basename(process.cwd());

  console.log(chalk.gray('  Environment:'));
  console.log(chalk.white('    Node.js:'), chalk.green(nodeVersion));
  console.log(chalk.white('    Directory:'), chalk.green(currentDir));
  console.log(chalk.white('    Converted With:'), chalk.green('Google Gemini AI\n'));

  console.log(chalk.cyan('  ─────────────────────────────────────────────────────────────────\n'));

  console.log(chalk.gray('  Quick Start:'));
  console.log(chalk.white('    1. Select') + chalk.yellow(' "Convert Component"'));
  console.log(chalk.white('    2. Choose your conversion type'));
  console.log(chalk.white('    3. Select components to convert'));
  console.log(chalk.white('    4. Review and validate output\n'));

  console.log(chalk.cyan('  ─────────────────────────────────────────────────────────────────\n'));

  console.log(chalk.gray('  Resources:'));
  console.log(chalk.white('    Get API Key:'), chalk.blue('https://aistudio.google.com/api-key'));
  console.log(chalk.white('    Repository:'), chalk.blue('https://github.com/L1malucas/converter-rn'));
  console.log(chalk.white('    Issues:'), chalk.blue('https://github.com/L1malucas/converter-rn/issues'));
  console.log(chalk.white('    Documentation:'), chalk.blue('https://github.com/L1malucas/converter-rn#readme\n'));

  console.log(chalk.cyan('  ─────────────────────────────────────────────────────────────────\n'));

  console.log(chalk.gray('  Project Info:'));
  console.log(chalk.white('    Author:'), chalk.green('L1malucas'));
  console.log(chalk.white('    License:'), chalk.green('MIT'));
  console.log(chalk.white('    Version:'), chalk.green('1.0.3\n'));

  console.log(chalk.yellow('  Need help? Use navigation menu or visit repository\n'));
}

module.exports = { showWelcome };