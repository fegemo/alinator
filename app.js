var http = require('http'),
    bl = require('bl'),
    cheerio = require('cheerio'),
    colors = require('colors'),
    fs = require('fs'),
    _ = require('underscore');

var config = require('./config.json');

var sessionReq = require('./sessionRequest'),
    loginReq = require('./loginRequest'),
    scheduleReq = require('./scheduleRequest');

console.log('Comecando a fazer ' + 'sessionRequest'.green + '...');
sessionReq.go(null, function(cookies) {
  console.log('Comecando a fazer ' + 'loginRequest'.green + '...');
  loginReq.go(cookies, function(cookies) {
    console.log('Comecando a fazer ' + 'scheduleRequest'.green + '...');
    scheduleReq.go(cookies, function(reservations) {
      //console.log(JSON.stringify(reservations));

      var templateFile = fs.readFileSync('./template.html').toString();
      fs.writeFileSync( './hoje.html', _.template(templateFile)({
        reservations: reservations
      }));
      console.log('Fim!!'.blue);
    });
  });
});
