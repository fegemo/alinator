#!/usr/bin/env node

var commander = require('commander'),
    updateNotifier = require('update-notifier'),
    open = require('open'),
    colors = require('colors'),
    logger = require('../lib/utils/logger'),
    pkg = require('../package.json'),
    app = require('../lib/app');

commander
  .version(pkg.version)
  .option('-s, --silent', 'Nao escreve nada no console')
  .parse(process.argv);

if (!commander.silent) {
  logger.on('log', console.log);
}

var notifier = updateNotifier({
  packageName: pkg.name,
  packageVersion: pkg.version,
  updateCheckInterval: 1000 * 60  // 1 minute
});

notifier.notify();

if (notifier.update) {
  console.log('Uma ' + 'nova versao'.green + '(' + notifier.update.latest + ') esta disponivel!');
  console.log('Execute o comando abaixo para instalar:');
  console.log('\t$ npm install -g alinator '.blue);
}

app.go(function(filePath) {
  console.log('Abrindo o arquivo: ' + filePath);
  open('file://' + filePath);
});
