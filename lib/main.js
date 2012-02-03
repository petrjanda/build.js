var Pipeline = require('./pipeline'),
    ClosureFilter = require('./filters/closureFilter'),
    HandlebarsCompileFilter = require('./filters/handlebarsCompileFilter'),
    ConcatFilter = require('./filters/concatFilter');

new Pipeline({
  input: 'src/lib/',
  output: 'application.js',
  pattern: '*.js',

  filters: [
    new ClosureFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})

new Pipeline({
  input: 'src/templates/',
  output: 'application.templates.js',
  pattern: '*.handlebars',

  filters: [
    new HandlebarsCompileFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})