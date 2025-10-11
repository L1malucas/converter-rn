const chalk = require('chalk');

function handleError(error) {
  console.error(chalk.red.bold('\n❌ Error occurred:\n'));
  
  if (error.message) {
    console.error(chalk.red(error.message));
  }
  
  if (error.stack && process.env.DEBUG) {
    console.error(chalk.gray('\nStack trace:'));
    console.error(chalk.gray(error.stack));
  }
  
  console.error(chalk.yellow('\nIf this error persists, please check:'));
  console.error(chalk.yellow('  1. Your Gemini API key is valid'));
  console.error(chalk.yellow('  2. You have internet connection'));
  console.error(chalk.yellow('  3. The component files are readable'));
  console.error('');
}

module.exports = { handleError };