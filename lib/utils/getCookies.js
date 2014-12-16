var cookie = require('cookie');

module.exports = function(setCookieHeaders, wanted) {
  var cookies = {};

  for (var i = 0; i < setCookieHeaders.length; i++) {
    var parsedCookie = cookie.parse(setCookieHeaders[i]);
    for (var c in parsedCookie) {
      if (parsedCookie.hasOwnProperty(c) && ((wanted.indexOf && wanted.indexOf(c) !== -1) || wanted === c)) {
        cookies[c] = parsedCookie[c];
      }
    }
  }

  return cookies;
};
