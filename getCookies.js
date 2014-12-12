var cookie = require('cookie'),
    colors = require('colors');

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

  //console.log('passando adiante: '.red + JSON.stringify(cookies));
  return cookies;
};
