'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

function createIterator(node, recursive) {
  return function* NodeIterator() {
    for (let entry in node.entries) {
      yield node.entries[entry];
      if (recursive) {
        yield* node.entries[entry].all;
      }
    }
  }
}

class FsNode {
  constructor (filepath) {
    if (!path.isAbsolute(filepath)) {
      filepath = path.resolve(filepath);
    }

    assert(fs.existsSync(filepath), `ENOENT: no such file or directory, FsNode '${filepath}'`);

    var cached = FsNode.cache.get(filepath);
    if (cached) {
      return cached;
    }
    FsNode.cache.set(filepath, this);

    this.path = filepath;
    this.cache = new Map();
    this[Symbol.iterator] = createIterator(this);
    this.all = {
      [Symbol.iterator]: createIterator(this, true)
    }
  }
  
  get allPaths() {
    var paths = [];

    for(let entry of this.all) {
      paths.push(entry.relativePath);
    }

    return paths;
  }
  
  get paths() {
    var paths = [];

    for(let entry of this) {
      paths.push(entry.relativePath);
    }

    return paths;
  }

  get entries() {
    if (this.isFile) {
      return;
    }

    var entries = this.cache.get('entries')
    if (entries) {
      return entries;
    }

    entries = {};
    var files = fs.readdirSync(this.path);
    for (let filename of files) {
      let entry = new FsNode(`${this.path}/${filename}`);

      entries[filename] = entry;
    }

    this.cache.set('entries', entries)
    return entries;
  }
   
  get relativePath() {
    return path.relative(process.cwd(), this.path);
  }

  get filename () {
    return path.basename(this.relativePath);
  }

  get relativeDirname () {
    return path.dirname(this.relativePath);
  }

  get realpath () {
    // after some benchmarks, it turns out that realpathSync's cache takes more time than explicit cache handling !!!
    var real = FsNode.realpaths.get(this.path)
    if (real) {
      return real
    }

    real = fs.realpathSync(this.path);
    FsNode.realpaths.set(this.path, real);
    return real;
  }

  get dirname () {
    return path.dirname(this.path);
  }

  get basename() {
    return path.basename(this.filename, this.extname);
  }

  get extname () {
    return path.extname(this.filename);
  }
  
  get isDirectory () {
    return this.stat.isDirectory();
  }

  get isSymlinkedDirectory () {
    return this.isDirectory && this.isSymbolicLink;
  }

  get isFile () {
    return !this.isDirectory;
  }

  get isSymlinkedFile () {
    return !this.isDirectory && this.isSymbolicLink;
  }

  get isSymbolicLink () {
    return this.lstat.isSymbolicLink();
  }

  get stat() {
    var stat = this.cache.get('stat')
    if (stat) {
      return stat;
    }

    stat = fs.statSync(this.path);
    this.cache.set('stat', stat);
    return stat;
  }

  get lstat () {
    var lstat = this.cache.get('lstat');
    if (lstat) {
      return lstat;
    }

    lstat = fs.lstatSync(this.path);
    this.cache.set('lstat', lstat);
    return lstat;
  }

  invalidate (key) {
    if (arguments.length) {
      assert(typeof key === 'string', `cache key must be a string`);
    }

    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }

    return this;
  }

  toString() {
    return this.path;
  }
}

FsNode.cache = new Map();
FsNode.realpaths = new Map();

module.exports = FsNode;
