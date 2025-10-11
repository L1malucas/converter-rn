const { showWelcome } = require('./cli/welcome');
const { showMainMenu } = require('./cli/menu');
const { initConfig } = require('./config/manager');
const { handleError } = require('./utils/error-handler');

async function main() {
  try {
    await initConfig();
    showWelcome();
    await showMainMenu();
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

main();