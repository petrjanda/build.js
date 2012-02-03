/*
 * Filter to take a list of the strings and return concatenated
 * result.
 *
 * @params {Options} Filter options.
 *         :separator - The character or a string which is used
 *                      for concatenation.
 */
 module.exports = ConcatFilter = function(options) {
  options = options || {};
  
  this.separator = options.separator || '';
}

ConcatFilter.prototype.process = function(data) {
  var result = '';

  for(var i in data) {
    result += data[i] + this.separator;
  }

  return result;
}