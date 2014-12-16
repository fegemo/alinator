#!/usr/bin/env node

var commander = require('commander'),
    open = require('open'),
    app = require('../lib/app');

app.go(function() {
  open('file://' + process.cwd() + '/hoje.html');  
});
