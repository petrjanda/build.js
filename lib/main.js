var watch = require('watch'),
    fs = require('fs'),
    path = require('path'),
    walk = require('walk'),

    watchers = {},
    options = {},
    dir = 'src/',
    pattern = new RegExp("*.js".replace('*', '.*'));

fs.watch(dir, function (event, filename) {
  check();
});

var check = function() {
  var walker = walk.walk(dir);

  walker.on("file", function (root, fileStats, next) {
    var filepath = root + fileStats.name;

    if(fs.statSync(filepath).isDirectory() || pattern.test(filepath)) {
      watchers[filepath] = fs.watch(filepath, function(event) {
        console.log(filepath);
      })
    }

    next();
  });
}

check();