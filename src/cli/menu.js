const inquirer = require('inquirer');
const { checkApiKey } = require('../config/api-key');
const { findComponents } = require('../scanner/finder');
const { displayTree } = require('../scanner/tree');
const { askComponentSelection, askOutputDirectory } = require('./prompts');
const { convertComponent } = require('../converter/gemini-client');
const { validateComponents } = require('../validator/check');
const { updateConfig } = require('../config/manager');
const { logSuccess, logInfo } = require('../utils/logger');

async function showMainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: '🔄 Convert Component', value: 'convert' },
        { name: '✅ Validate Converted Components', value: 'validate' },
        { name: '🔑 Change Gemini API Key', value: 'apikey' },
        { name: '🚪 Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'convert':
      await handleConvert();
      break;
    case 'validate':
      await handleValidate();
      break;
    case 'apikey':
      await handleApiKey();
      break;
    case 'exit':
      logInfo('Goodbye!');
      process.exit(0);
  }

  await showMainMenu();
}

async function handleApiKey() {
  const { saveApiKey } = require('../config/api-key');
  await saveApiKey(true);
}

async function handleConvert() {
  await checkApiKey();
  const components = await findComponents(process.cwd());
  
  if (components.length === 0) {
    logInfo('No Angular components found in current directory.');
    return;
  }

  displayTree(components);
  const selectedComponent = await askComponentSelection(components);
  const outputDir = await askOutputDirectory();
  
  await convertComponent(selectedComponent, outputDir);
  logSuccess('Conversion completed!');
}

async function handleValidate() {
  await validateComponents(process.cwd());
}



module.exports = { showMainMenu };