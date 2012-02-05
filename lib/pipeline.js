var fs = require('fs'),
    path = require('path'),
    walk = require('walk'),
    Logger = require('./logger');

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

  this.logger = new Logger({level: 2});
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
    var targetPath = path.normalize(path.join(root, fileStats.name));

    if(self.regexp.test(targetPath)) {
      self.watch(targetPath, false);
    }

    next();
  });

  walker.on("directories", function(root, dirStatsArray, next) {
    var length = dirStatsArray.length;

    for(var i = 0; i < length; i++) {
      var targetPath = path.normalize(path.join(root, dirStatsArray[i].name));
      
      self.watch(targetPath, true);
    }

    next();
  });

  walker.on('end', function() {
    self.process();
  })
}

Pipeline.prototype.watch = function(targetPath, isDir) {
  var self = this;
  
  if(this.watchers[targetPath]) {
    return;
  }

  this.logger.debug('[watching] ' + targetPath);

  this.watchers[targetPath] = fs.watch(targetPath, function() {

    isDir ? self.scan() : self.loadFile(targetPath);
    self.process();
  })

  if(!isDir) {
    this.loadFile(targetPath); 
  }
}

Pipeline.prototype.loadFile = function(targetPath, isReload) {
  var relativePath = path.relative(this.input, targetPath);

  try {
    this.files[relativePath] = fs.readFileSync(targetPath, 'utf8');
  } catch(e) {
    delete this.files[relativePath];
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
  this.logger.info('[generated] ' + this.output + ' (' + Math.floor(buffer.length / 1024) + ' kB)');
}