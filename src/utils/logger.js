const chalk = require('chalk');

function logSuccess(message) {
  console.log(chalk.green('✓ ') + message);
}

function logError(message) {
  console.log(chalk.red('✗ ') + message);
}

function logWarning(message) {
  console.log(chalk.yellow('⚠ ') + message);
}

function logInfo(message) {
  console.log(chalk.blue('ℹ ') + message);
}

module.exports = {
  logSuccess,
  logError,
  logWarning,
  logInfo
};