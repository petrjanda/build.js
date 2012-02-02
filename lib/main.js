var Pipeline = require('./pipeline'),
    ClosureFilter = require('./closureFilter'),
    ConcatFilter = require('./concatFilter');

//    dir = 'src/';
//    pattern = new RegExp("*.js".replace('*', '.*'));

new Pipeline({
  input: 'src/',
  output: 'lib/',
  filters: [
    new ClosureFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})