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
  await checkApiKey();
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: '🔄 Convert Component', value: 'convert' },
        { name: '✅ Validate Converted Components', value: 'validate' },
        { name: '⚙️  Configure Settings', value: 'configure' },
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
    case 'configure':
      await handleConfigure();
      break;
    case 'exit':
      logInfo('Goodbye!');
      process.exit(0);
  }

  await showMainMenu();
}

async function handleConvert() {
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

async function handleConfigure() {
  const { setting } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setting',
      message: 'Configure:',
      choices: [
        { name: 'Change Gemini API Key', value: 'apikey' },
        { name: 'Change Default Output Directory', value: 'output' },
        { name: 'Back to Main Menu', value: 'back' }
      ]
    }
  ]);

  if (setting === 'back') return;

  if (setting === 'apikey') {
    const { saveApiKey } = require('../config/api-key');
    await saveApiKey(true);
  }

  if (setting === 'output') {
    const { output } = await inquirer.prompt([
      {
        type: 'input',
        name: 'output',
        message: 'Default output directory:',
        default: './converted'
      }
    ]);
    await updateConfig({ outputDir: output });
    logSuccess('Output directory updated!');
  }
}

module.exports = { showMainMenu };