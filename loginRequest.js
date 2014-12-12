var http = require('http'),
    url = require('url'),
    cookie = require('cookie'),
    getCookies = require('./getCookies'),
    querystring = require('querystring'),
    config = require('./config.json');

var loginUrl = url.parse(config.urls.login);

module.exports = {
  go: function(data, next) {
    var postData = {
      email: config.credentials.user,
      password: config.credentials.pwd,
      language: 'en_US',
      setCookie: true,
      login: 'Log+In',
      resume: ''
    };
    var encodedPostData = querystring.stringify(postData);

    var req = http.request({
        method: 'POST',
        host: loginUrl.host,
        path: loginUrl.path,
        headers: {
          'Accept': 'text/html',
          'Cookie': cookie.serialize('PHPSESSID', data.PHPSESSID),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': encodedPostData.length,
          'User-Agent': 'Alinator'
        }
      }, function(res) {
        res.destroy();
        var newCookies = getCookies(res.headers['set-cookie'] || res.headers['Set-Cookie'], ['PHPSESSID', 'ID']);
        data.ID = newCookies.ID;
        if (next) next(data);
      });

    req.write(querystring.stringify(postData));
    req.end();
  }
};
