#!/usr/bin/env node

var commander = require('commander'),
    // nconf = require('nconf'),
    fs = require('fs'),
    updateNotifier = require('update-notifier'),
    open = require('open'),
    colors = require('colors'),
    logger = require('../lib/utils/logger'),
    pkg = require('../package.json'),
    app = require('../lib/app');

commander
  .version(pkg.version)
  .description(pkg.description)
  .option('-s, --silent', 'Nao escreve nada no console')
  .option('-u, --username <v>', 'Define o usuario que sera usado para fazer login no sistema de agendamento (nome_decom)')
  .option('-p, --password <v>', 'Define a senha que sera usada para fazer login no sistema de agendamento')
  .parse(process.argv);

if (!commander.silent) {
  logger.on('log', console.log);
  logger.on('error', console.error);
}

var config = require('../config.json');
config.credentials.user = commander.username || config.credentials.user;
config.credentials.pwd = commander.password || config.credentials.pwd;

if (!config.credentials.user || !config.credentials.pwd) {
  commander.help();
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

app.go(config, function(filePath) {
  console.log('Abrindo o arquivo: ' + filePath);
  open('file://' + filePath);
});
