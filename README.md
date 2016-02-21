# FsNode

[![Build Status](https://travis-ci.org/g13013/node-fs-node.svg?branch=master)](https://travis-ci.org/g13013/node-fs-node)
[![Dependencies](https://david-dm.org/g13013/node-fs-node.svg)](https://www.npmjs.com/package/fs-node)
[![DevDependencies](https://david-dm.org/g13013/node-fs-node/dev-status.svg)](https://www.npmjs.com/package/fs-node)
[![Issue Count](https://codeclimate.com/github/g13013/node-fs-node/badges/issue_count.svg)](https://www.npmjs.com/package/fs-node)

[![Issue Count](https://nodei.co/npm/fs-node.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/fs-node)

A class that represents a file system folder or file entry,
it implements a caching system and accessors for lazy information lookup.
The whole thing is iterable using [ES2015](http://www.ecma-international.org/ecma-262/6.0/) [Symbol.iterator](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Symbol/iterator) and [Generators](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Generator).

## Usage

### Initialisation

```js
const FsNode = require('fs-node');
var dir = new FsNode('.');
var dir2 = new FsNode('.');
var file = new FsNode('file_name');
var file2 = new FsNode('file_name_full_path');

if (dir === dir2 && file === file2) {
  console.log('true')
}

```

### List files

```js
var files = dir.paths; // [...]
var allFiles = dir.allPaths; // [...]
```

### Iteration

```js
// one level iteration
for(let entry of dir) {
  // do stuff
}


// recursive iteration
for(let entry of dir.all) {
  // do stuff
}

var file = new FsNode('some_file');

// files are not iterable ... right ?
for(let entry of file) {
  // no doubt
}

```

### Properties

```js
var file = new FsNode('some_file');

console.log(file.cache);// instance of Map
console.log(file.filename);
console.log(file.relativePath); // to process.cwd()
console.log(file.relativeDirname); // to process.cwd()
console.log(file.realpath); //cached
console.log(file.path);
console.log(file.dirname);
console.log(file.basename); // without extension
console.log(file.extname); // '.*'
console.log(file.isDirectory); // cached
console.log(file.isSymlinkedDirectory); // cached
console.log(file.isFile); // cached
console.log(file.isSymlinkedFile);
console.log(file.isSymbolicLink);
console.log(file.stat); // cached
console.log(file.lstat); // cached
```

### Cache

```js
var file = new FsNode('some_file');

console.log(file.stat); // cached
console.log(file.lstat); // cached
console.log(file.invalidate('stat').stat); // invalidate and force lookup using fs.stat
console.log(file.stat); // cached again
console.log(file.invalidate()); // clear cache and
console.log(file.lstat); // now use fs.lstat

console.log(FsNode.cache); // all FsNode instances
console.log(FsNode.realpaths); // instance of Map - path => realpath
```

## Performance

This module includes very basic benchmarks that produce good results
especially when it's question of repeated operations

```sh
node tests/bench.js
```

## Tests

```sh
npm test
```

## Contributions

I am waiting for your pull requests

## Licence

The MIT License (MIT)
