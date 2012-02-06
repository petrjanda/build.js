# build.js = node web pipeline

Build.js is a build tool, which processes your source codes, in order to output transformed version. You can use it to
concatenate files, compile CoffeeScript sources to javascript, wrap your JavaScript into closures or do all of it together. Its blazingly fast and can be easily integrated to your existing node.js backend in development mode - no need to spawn any other compile or processing tool.

## Installation and configuration

Build.js is available as npm package, so can be installed by command:

    npm install build.js

Your installation is ready and now, you only have to configure your data processing pipelines. Pipeline defines serie
of transformation, which will be done over input files and result in the output. The input files can be filtered by a 
pattern, so you can pick only files with specific type or name.

Pipeline, to take all javascript files, wrap them into function and concatenate to output file might look like this:

```javascript
var buildJs = require('build.js');

new buildJs.Pipeline({
  input: 'lib/',
  output: 'dist/',
  pattern: '*.js',

  filters: [
    new ClosureFilter(),
    new ConcatFilter({ separator: '\n'})
  ]
})
```

When the pipeline is created, it walks through input folder and search for all the files matching patterns to start 
watching. After each change to any of watched files, its reloaded and reprocessed to imediatelly build new pipeline output. If you add or remove new file, build.js would detect that.

## Extend build.js

Build.js comes with few predefined filters out of the box, although makes it very simple to write your own, to extend its possibilities. Each filter is a simple class, which takes array of input files, do processing and output the list
of output files back.

The simpliest filter, which does nothing, would look like this:

```javascript
module.exports = MyFilter = function(options) {}

MyFilter.prototype.process = function(data) {
  for(var i in data) {
    data[i] = data[i]; // Here you should do any kind of processing. data array is list of file contents.
  }

  return data;
}
```

## License

Copyright (C) 2012 Petr Janda

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.