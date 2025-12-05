const inquirer = require('inquirer');
const { checkApiKey } = require('../config/api-key');
const { findComponents } = require('../scanner/finder');
const { findReactComponents } = require('../scanner/react-finder');
const { displayTree } = require('../scanner/tree');
const { askComponentSelection, askOutputDirectory, askConversionType } = require('./prompts');
const { convertComponent } = require('../converter/gemini-client');
const { convertReactToAngular } = require('../converter/angular-client');
const { validateComponents } = require('../validator/check');
const { validateAngularComponents } = require('../validator/angular-check');
const { updateConfig } = require('../config/manager');
const { logSuccess, logInfo } = require('../utils/logger');

async function showMainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: 'Convert Component', value: 'convert' },
        { name: 'Validate Converted Components', value: 'validate' },
        { name: 'Change Gemini API Key', value: 'apikey' },
        { name: 'Exit', value: 'exit' }
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

  const conversionType = await askConversionType();

  if (conversionType === 'ionic-to-rn') {
    await handleIonicToRNConvert();
  } else if (conversionType === 'react-to-angular') {
    await handleReactToAngularConvert();
  }
}

async function handleIonicToRNConvert() {
  const components = await findComponents(process.cwd());

  if (components.length === 0) {
    logInfo('No Angular/Ionic components found in current directory.');
    return;
  }

  displayTree(components);
  const selectedComponent = await askComponentSelection(components);
  const outputDir = await askOutputDirectory();

  await convertComponent(selectedComponent, outputDir);
  logSuccess('Conversion completed!');
}

async function handleReactToAngularConvert() {
  const components = await findReactComponents(process.cwd());

  if (components.length === 0) {
    logInfo('No React components found in current directory.');
    return;
  }

  displayTree(components);
  const selectedComponent = await askComponentSelection(components);
  const outputDir = await askOutputDirectory();

  await convertReactToAngular(selectedComponent, outputDir);
  logSuccess('Conversion completed!');
}

async function handleValidate() {
  const validationType = await askValidationType();

  if (validationType === 'react-native') {
    await validateComponents(process.cwd());
  } else if (validationType === 'angular') {
    await validateAngularComponents(process.cwd());
  }
}

async function askValidationType() {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Which type of components do you want to validate?',
      choices: [
        { name: 'React Native components (.tsx)', value: 'react-native' },
        { name: 'Angular components (.component.ts)', value: 'angular' }
      ]
    }
  ]);
  return type;
}



module.exports = { showMainMenu };