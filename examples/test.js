var Pipeline = require('./lib/main').Pipeline,
    ClosureFilter = require('./lib/main').ClosureFilter,
    ConcatFilter = require('./lib/main').ConcatFilter,
    GhostFilter = require('./lib/main').GhostFilter,
    HandlebarsCompileFilter = require('./lib/main').HandlebarsCompileFilter,
    express = require('express');

var app = express.createServer();

app.use(express.static(__dirname));
app.listen(4000);


new Pipeline({
  input: 'src/',
  output: 'application.js',
  pattern: '*.js',

  filters: [
    new GhostFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})