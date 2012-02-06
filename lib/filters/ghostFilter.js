/*
 * Filter to generate module registration for ghost.js. It register each file
 * as a module, using its relative path (without extension) as module name.
 *
 * The output per file looks like:
 * register('foo/bar', function() {
 *   console.log('FooBar executed!');
 * })
 *
 * For more information about ghost.js dependency micro-framework, go to
 * https://github.com/petrjanda/ghost.js.
 */
module.exports = GhostFilter = function(options) {}

GhostFilter.prototype.process = function(data) {
  for(var i in data) {
    var templateName = i.split('.');
    templateName.pop();
    templateName = templateName.join('.');

    data[i] = 'register(\'' + templateName + '\', function() {\n' + data[i] + '\n});';
  }

  return data;
}