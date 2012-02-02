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