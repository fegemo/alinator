var request = require('request'),
    url = require('url'),
    cookie = require('cookie'),
    querystring = require('querystring'),
    cheerio = require('cheerio'),
    getCookies = require('../utils/getCookies');

module.exports = {
  go: function(data, config, next, error) {
    var postData = {
      email: config.credentials.user,
      password: config.credentials.pwd,
      language: 'en_US',
      setCookie: true,
      login: 'Log+In',
      resume: ''
    };
    var encodedPostData = querystring.stringify(postData);

    request.post({
      url: config.urls.login,
      headers: {
        'Accept': 'text/html',
        'Cookie': cookie.serialize('PHPSESSID', data.PHPSESSID),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': encodedPostData.length,
        'User-Agent': 'Alinator'
      },
      body: querystring.stringify(postData)
    }, function(err, res, body) {
      if (!res || !body && err) {
        error({ message: err });
        return;
      }
      var newCookies = getCookies(res.headers['set-cookie'] || res.headers['Set-Cookie'], ['PHPSESSID', 'ID']),
          $ = cheerio.load(body),
          $errorMessage = $('table.alert').find('td').eq(0);
      data.ID = newCookies.ID;

      if ($errorMessage.length > 0) {
        error({ message: $errorMessage.text() });
        return;
      }

      if (next) next(data);
    });
  }
};
