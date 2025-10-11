const inquirer = require('inquirer');
const path = require('path');

async function askComponentSelection(components) {
  const choices = components.map(comp => ({
    name: `${comp.name} (${comp.path})`,
    value: comp
  }));

  const { component } = await inquirer.prompt([
    {
      type: 'list',
      name: 'component',
      message: 'Select component to convert:',
      choices,
      pageSize: 15
    }
  ]);

  return component;
}

async function askOutputDirectory() {
  const { useDefault } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDefault',
      message: 'Save in same directory as source?',
      default: true
    }
  ]);

  if (useDefault) {
    return null;
  }

  const { customDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customDir',
      message: 'Output directory:',
      default: './converted'
    }
  ]);

  return customDir;
}

module.exports = {
  askComponentSelection,
  askOutputDirectory
};