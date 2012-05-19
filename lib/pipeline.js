var fs = require('fs'),
    path = require('path'),
    walk = require('walk'),
    Logger = require('./logger');

module.exports = Pipeline = function(options) {
  options = options || {};

  this.watch = options.watch;

  this.input = options.input;

  this.output = options.output;

  this.pattern = options.pattern || '*';

  this.regexp = new RegExp(this.pattern.replace('*', '.*'));

  this.watchers = {};

  this.filters = options.filters || [];
  
  this.files = {};

  this.init(this.watch);

  this.logger = new Logger({level: 2});
}

Pipeline.prototype.init = function(watch) {
  var self = this,
      watch = watch || true;

  if(watch) {
    fs.watch(this.input, function (event, filename) {
      self.scan();
    });
  }

  this.scan();
}

Pipeline.prototype.scan = function() {
  var self = this,
      walker = walk.walk(this.input),
      files = 0,
      finished = false;

  walker.on("file", function(root, fileStats, next) {
    var targetPath = path.normalize(path.join(root, fileStats.name));

    if(self.regexp.test(targetPath)) {
      files++;

      self.watch(targetPath, false, function() {
        files--;

        if(files == 0 && finished) {
          self.process();
        }
      });
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
    finished = true;

    if(files == 0 && finished) {
      self.process();
    }
  })
}

Pipeline.prototype.watch = function(targetPath, isDir, callback) {
  var self = this;
  
  if(this.watchers[targetPath]) {
    return;
  }

  this.logger.debug('[watching] ' + targetPath);

  this.watchers[targetPath] = fs.watch(targetPath, function() {

    isDir ? self.scan() : self.loadFile(targetPath, function() {
      self.process();
    });
  })

  if(!isDir) {
    this.loadFile(targetPath, function() {
      callback ? callback() : null;
    }); 
  } else {
    callback ? callback() : null;
  }
}

Pipeline.prototype.loadFile = function(targetPath, callback) {
  var self = this,
      relativePath = path.relative(this.input, targetPath);

  fs.readFile(targetPath, 'utf8', function(err, data) {
    if(err) {
      self.logger.debug('[unwatch] ' + targetPath);
      delete self.files[relativePath];
      return;      
    }

    self.files[relativePath] = data;  
    self.logger.debug('[updated] ' + targetPath + ' (' + Math.floor(self.files[relativePath].length / 1024) + ' kB)');

    if(typeof(callback) == 'function') {
      callback(); 
    }
  })
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
