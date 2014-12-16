var http = require('http'),
    url = require('url'),
    getCookies = require('../utils/getCookies'),
    config = require('../../config.json');

var homepageUrl = url.parse(config.urls.homepage);

module.exports = {
  go: function(data, next) {
    var req = http.request({
        method: 'HEAD',
        host: homepageUrl.host,
        path: homepageUrl.path
      }, function(res) {
        res.destroy();
        var cookies = getCookies(res.headers['set-cookie'] || res.headers['Set-Cookie'], 'PHPSESSID');
        if (next) next(cookies);
      });
    req.end();
  }
};
