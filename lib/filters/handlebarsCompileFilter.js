/*
 * Filter to wrap the handlebars bare templates into html
 * script tag with text/handlebars type, in order to be 
 * parsed by handlebars loader in Ember.js
 */
module.exports = HandlebarsCompileFilter = function(options) {}

HandlebarsCompileFilter.prototype.process = function(data) {
  for(var i in data) {
    var templateName = i.split('.');
    templateName.pop();
    templateName = templateName.join('.');

    data[i] = data[i].replace('"', '\"');    
    data[i] = 'Ember.TEMPLATES["' + templateName + '"] = Ember.Handlebars.compile("' + data[i] + '")';
  }

  return data;
}