module.exports = {
  Pipeline: require('./pipeline'),
  ClosureFilter: require('./filters/closureFilter'),
  HandlebarsCompileFilter: require('./filters/handlebarsCompileFilter'),
  GhostFilter: require('./filters/ghostFilter'),
  ConcatFilter: require('./filters/concatFilter')
}