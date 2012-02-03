var Pipeline = require('./pipeline'),
    ClosureFilter = require('./filters/closureFilter'),
    ConcatFilter = require('./filters/concatFilter');

new Pipeline({
  input: 'src/',

  output: 'application.js',

  pattern: '*_test.js',

  filters: [
    new ClosureFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})