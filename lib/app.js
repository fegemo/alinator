var http = require('http'),
    path = require('path'),
    cheerio = require('cheerio'),
    colors = require('colors'),
    fs = require('fs'),
    _ = require('underscore'),
    moment = require('moment');

moment.locale('pt-br');

var config = require('../config.json');

var sessionReq = require('./requests/sessionRequest'),
    loginReq = require('./requests/loginRequest'),
    scheduleReq = require('./requests/scheduleRequest');

var logger = require('./utils/logger');


module.exports = {
  go: function(callback) {
    logger.emit('log', 'Comecando a fazer ' + 'sessionRequest'.green + '...');
    sessionReq.go(null, function(cookies) {
      logger.emit('log', 'Comecando a fazer ' + 'loginRequest'.green + '...');
      loginReq.go(cookies, function(cookies) {
        logger.emit('log', 'Comecando a fazer ' + 'scheduleRequest'.green + '...');
        scheduleReq.go(cookies, function(reservations, date) {
          var templateFile = fs.readFileSync('./lib/templates/template.html').toString();
          var fileName = 'projetores_' + date.format('DD-MMM-YYYY') + '.html';
          var filePath = path.join(process.cwd(), fileName);
          fs.writeFileSync(filePath, _.template(templateFile)({
            reservations: reservations,
            date: date.format('DD-MMM-YYYY'),
            day: date.format('dddd')
          }));
          if (callback) callback(filePath);
        });
      });
    });
  }
};
