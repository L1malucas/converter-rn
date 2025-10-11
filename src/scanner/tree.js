const chalk = require('chalk');

function displayTree(components) {
  console.log(chalk.cyan.bold('\n📦 Components Found:\n'));
  
  const tree = {};
  
  components.forEach(comp => {
    const parts = comp.path.split('/');
    let current = tree;
    
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? { _component: comp } : {};
      }
      current = current[part];
    });
  });

  printTree(tree, '', true);
  console.log(chalk.gray(`\nTotal: ${components.length} components\n`));
}

function printTree(node, prefix = '', isLast = true) {
  const keys = Object.keys(node).filter(k => k !== '_component');
  
  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    const extension = isLastItem ? '    ' : '│   ';
    
    if (node[key]._component) {
      console.log(prefix + connector + chalk.green(key) + chalk.gray(` (${node[key]._component.name})`));
    } else {
      console.log(prefix + connector + chalk.yellow(key));
      printTree(node[key], prefix + extension, isLastItem);
    }
  });
}

module.exports = { displayTree };