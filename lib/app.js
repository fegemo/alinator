var http = require('http'),
    path = require('path'),
    colors = require('colors'),
    fs = require('fs'),
    _ = require('underscore'),
    moment = require('moment'),
    configPersist = require('./utils/configPersist');

moment.locale('pt-br');

var config = require('../config.json');

var sessionReq = require('./requests/sessionRequest'),
    loginReq = require('./requests/loginRequest'),
    scheduleReq = require('./requests/scheduleRequest');

var logger = require('./utils/logger');


module.exports = {
  go: function(config, callback) {
    logger.emit('log', 'Comecando a fazer ' + 'sessionRequest'.green + '...');
    sessionReq.go(null, config, function(cookies) {
      logger.emit('log', 'Comecando a fazer ' + 'loginRequest'.green + '... ' + 'usando (' + config.credentials.user + ')');
      loginReq.go(cookies, config, function(cookies) {
        logger.emit('log', 'Comecando a fazer ' + 'scheduleRequest'.green + '...');
        scheduleReq.go(cookies, config, function(reservations, date) {
          var templateFile = fs.readFileSync(path.join(__dirname, 'templates/template.html')).toString();
          var fileName = 'projetores_' + date.format('DD-MMM-YYYY') + '.html';
          var filePath = path.join(process.cwd(), fileName);
          try {
            fs.writeFileSync(filePath, _.template(templateFile)({
              reservations: reservations,
              date: date.format('DD-MMM-YYYY'),
              day: date.format('dddd')
            }));
            if (callback) callback(filePath);
          } catch (err) {
            logger.emit('error', 'Nao foi possivel escrever o arquivo. Detalhes: ' + err.toString().red);
          }

          configPersist.save(__dirname + '/../config.json', config);
        });
      }, function loginError(error) {
        logger.emit('error', 'Houve um erro de login: ' + error.message.red);
        config.credentials.user = '';
        config.credentials.pwd = '';
        configPersist.save(__dirname + '/../config.json', config);
      });
    });
  }
};
