# Basement = node.js web pipeline

Basement target is to simpify life to frontend developers. Idea comes from Ruby driven project called rake pipeline.
You are allowed to define your file processing in a declarative way, in order to automate your build system for your
frontend application.

Because basement, can be integrated to any node.js application, its target is to extend your reach within your one and
only development server, without need to spawn any other tool.

## How does it work?

The system watch in a given location, once you specify in your pipeline configuration. Each time you create / update / delete the file, its content is reloaded and together with other loaded files pipeline processing is invoked. In order
to customize its behavior, you are able to build it up from couple predefined filters.

## How to start?

Installation with npm is easy as:

    npm install basement

Then anywhere in your application create a pipeline definition. If you write Ember.js app with handlebars templates, it
might look like this:

```javascript
Pipeline = require('basement').Pipeline;
ClosureFilter = require('basement').ClosureFilter;
ConcatFilter = require('basement').ConcatFilter;
HandlebarsCompileFilter = require('basement').HandlebarsCompileFilter;

new Pipeline({
  input: 'frontend/lib',
  output: 'application.js',
  pattern: '*.js',

  filters: [
    new ClosureFilter(),
    new ConcatFilter({
      separator: '\n\n'
    })
  ]
})

new Pipeline({
  input: 'frontend/lib/templates/',
  output: 'application.templates.js',
  pattern: '*.handlebars',

  filters: [
    new HandlebarsCompileFilter(),
    new ConcatFilter({
      separator: '\n'
    })
  ]
})
```

The definition should be self descripting. Per pipeline you specify input folder and output file and a pattern, which is
used to filter only specific files. Pattern might also look for instance like ```*_test.js``` to compile your tests together.

The list of filters is executed in a specific order. 

## Extend with your own filters

The simpliest filter which just proxy content, without any modification might look like this.

```javascript
module.exports = MyFilter = function(options) {}

MyFilter.prototype.process = function(data) {
  for(var i in data) {
    data[i] = data[i]
  }

  return data;
}
```