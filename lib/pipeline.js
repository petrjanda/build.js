var watch = require('watch'),
    fs = require('fs'),
    path = require('path'),
    walk = require('walk');

module.exports = Pipeline = function(options) {
  options = options || {};

  this.input = options.input;
  this.output = options.output;
  this.pattern = options.pattern || '*';
  this.regexp = new RegExp(this.pattern.replace('*', '.*'));

  this.watchers = {};
  this.filters = options.filters || [];
  this.files = {};

  this.init();
}

Pipeline.prototype.init = function() {
  var self = this;

  fs.watch(this.input, function (event, filename) {
    self.scan();
  });

  this.scan();
}

Pipeline.prototype.scan = function() {
  var self = this,
      walker = walk.walk(this.input);

  walker.on("file", function(root, fileStats, next) {
    if(self.regexp.test(root + fileStats.name)) {
      self.watch(root + fileStats.name, false);
    }

    next();
  });

  walker.on("directories", function(root, dirStatsArray, next) {
    var length = dirStatsArray.length;

    for(var i = 0; i < length; i++) {
      self.watch(root + dirStatsArray[i].name, true);
    }

    next();
  });

  walker.on('end', function() {
    self.process();
  })
}

Pipeline.prototype.watch = function(targetPath, isDir) {
  var self = this;
  this.watchers[targetPath] = fs.watch(targetPath, function() {
    isDir ? self.scan() : self.loadFile(targetPath);
    self.process();
  })

  isDir ? self.scan() : self.loadFile(targetPath);
}

Pipeline.prototype.loadFile = function(targetPath, isReload) {
  try {
    this.files[targetPath] = fs.readFileSync(targetPath, 'utf8');
  } catch(e) {
    delete this.files[targetPath];
  }
}

Pipeline.prototype.process = function() {
  var length = this.filters.length,
      buffer = {};

  for(var keys = Object.keys(this.files), l = keys.length; l; --l) {
   buffer[keys[l-1]] = this.files[keys[l-1]];
  }

  for(var i = 0; i < length; i++) {
    buffer = this.filters[i].process(buffer);
  }
  
  fs.writeFileSync(this.output, buffer, 'utf8');
  console.log('[generated] ' + this.output);
}