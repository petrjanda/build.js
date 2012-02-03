/*
 * Filter to wrap the handlebars bare templates into html
 * script tag with text/handlebars type, in order to be 
 * parsed by handlebars loader in Ember.js
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