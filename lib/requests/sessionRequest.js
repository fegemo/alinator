var request = require('request'),
    url = require('url'),
    getCookies = require('../utils/getCookies');

module.exports = {
  go: function(data, config, next) {
    request({
      method: 'HEAD',
      url: config.urls.homepage
    }, function(err, res) {
      var cookies = getCookies(res.headers['set-cookie'] || res.headers['Set-Cookie'], 'PHPSESSID');
      if (next) next(cookies);
    });
  }
};
