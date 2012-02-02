//  this.pattern = options.pattern || "*";
//     if(pattern.test(filepath)) {
module.exports = ClosureFilter = function(options) {}

ClosureFilter.prototype.process = function(data) {
  for(var i in data) {
    data[i] = '(function() {\n' + data[i] + '\n})()'
  }

  return data;
}