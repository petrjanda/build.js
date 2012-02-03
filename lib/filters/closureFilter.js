/*
 * Filter to wrap the files into javascript closure in order
 * to avoid namespace issues.
 */
module.exports = ClosureFilter = function(options) {}

ClosureFilter.prototype.process = function(data) {
  for(var i in data) {
    data[i] = '(function() {\n' + data[i] + '\n})()'
  }

  return data;
}