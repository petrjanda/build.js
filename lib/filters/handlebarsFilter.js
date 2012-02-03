/*
 * Filter to wrap the handlebars bare templates into html
 * script tag with text/handlebars type, in order to be 
 * parsed by handlebars loader in Ember.js
 */
module.exports = HandlebarsFilter = function(options) {}

HandlebarsFilter.prototype.process = function(data) {
  for(var i in data) {
    data[i] = '<script type="text/x-handlebars" id="' + i + '">' + data[i] + '</script>';
  }

  return data;
}