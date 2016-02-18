# FsNode

A class that represents a file system folder or file entry,
it implements a caching system and accessors for lazy information lookup.
The hole thing is iterable using ES2015 `Symbol.iterator` and `generators`.

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
for(let entry in dir) {
  // do stuff
}


// recursive iteration
for(let entry in dir.all) {
  // do stuff
}

var file = new FsNode('some_file');

// files are not iterable ... right ?
for(let entry in file) {
  // no doubt
}

```

### Properties

```js
var file = new FsNode('some_file');

file.cache = // Map instance
file.filename;
file.relativePath; // to process.cwd()
file.relativeDirname; // to process.cwd()
file.realpath; //cached
file.path;
file.dirname;
file.basename; // without extension
file.extname; // '.*'
file.isDirectory; // cached
file.isSymlinkedDirectory; // cached
file.isFile; // cached
file.isSymlinkedFile;
file.stat; // cached
file.lstat; // cached
```

### Cache

```js
var file = new FsNode('some_file');

file.stat; // cached
file.lstat; // cached
file.invalidate('stat').stat; // invalidate and force lookup using fs.stat
file.stat; // cached again
file.invalidate(); // clear cache
file.lstat; // now use fs.lstat

FsNode.cache; // all FsNode instances
FsNode.realpaths; // instance of Map - path => realpath
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
