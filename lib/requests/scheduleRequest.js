var http = require('http'),
    url = require('url'),
    request = require('request'),
    cookie = require('cookie'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    config = require('../../config.json');


var scheduleUrl = url.parse(config.urls.schedule);

module.exports = {
  go: function(data, next) {
    var reservations = {};

    request({
      url: config.urls.schedule,
      headers: {
        'Cookie': cookie.serialize('PHPSESSID', data.PHPSESSID)
      }
    }, function(error, res, body) {
      var $,
          $tableToday,
          $projectorRows;

      if (!error && res.statusCode === 200) {
        $ = cheerio.load(body);
        $tableToday = $('.scheduleDateCurrent').closest('table');
        $projectorRows = $tableToday.find('tr:has(td:contains("' + config.projectorsSearchString + '"))');

        $projectorRows.each(function(i, row) {
          var $row = $(row);
          var projectorName = $row.find('td.resourceName').text();
          reservations[projectorName] = [];

          var accum10MinReservations = 0;
          var allocations = $row.find('td:has(div)');
          allocations.each(function(i, cell) {
            var $cell = $(cell);
            var start10Min = $cell.index() + accum10MinReservations;
            var duration10Min = parseInt($cell.attr('colspan') || 1);
            var startTime = moment()
              .millisecond(0)
              .seconds(0)
              .minute(0)
              .hour(config.dayStartHour)
              .add(start10Min * config.timeSlotInMin, 'minutes');
            var endTime = moment(startTime).add(duration10Min * config.timeSlotInMin, 'minutes');

            var allocation = {
              person: $cell.find('div.inlineSummary').html(),
              start: startTime.format('HH:mm'),
              end: endTime.format('HH:mm')
            };
            reservations[projectorName].push(allocation);

            accum10MinReservations += duration10Min - 1;
          });
        });
      }

      if (next) next(reservations);
    });
  }
};
