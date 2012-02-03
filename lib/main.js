var Pipeline = require('./pipeline'),
    ClosureFilter = require('./filters/closureFilter'),
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