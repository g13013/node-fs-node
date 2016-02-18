'use strict';

const FsNode = require(process.cwd());

var paths = [
  'tmp/sub',
  'tmp/sub_sym',
  'tmp/test_file.txt',
  'tmp/test_file_sym.txt'
].sort()
var allPaths = paths.concat(['tmp/sub/test_file.txt', 'tmp/sub_sym/test_file.txt']).sort();

module.exports = {
  singleton(test) {
    test.deepEqual(new FsNode('tmp'), new FsNode('tmp'));
    test.done();
  },

  regularFile(test) {
    var file = new FsNode('tmp/test_file.txt');

    test.equal(file.path, process.cwd() + '/tmp/test_file.txt', 'path');
    test.equal(file.realpath, file.path, 'realpath');
    test.equal(file.relativePath, 'tmp/test_file.txt', 'relativePath');
    test.equal(file.dirname, process.cwd() + '/tmp', 'dirname');
    test.equal(file.relativeDirname, 'tmp', 'relativeDirname');
    test.equal(file.basename, 'test_file', 'basename');
    test.equal(file.extname, '.txt', 'extname');
    test.strictEqual(file.isFile, true, 'isFile');
    test.strictEqual(file.isSymlinkedFile, false, 'isSymlinkedFile');
    test.strictEqual(file.isDirectory, false, 'isDirectory');
    test.strictEqual(file.isSymlinkedDirectory, false, 'isDirectory');
    test.strictEqual(file.isSymbolicLink, false, 'isSymbolicLink');
    test.done();
  },

  symlinkFile(test) {
    var file = new FsNode('tmp/test_file_sym.txt');
    test.equal(file.path, process.cwd() + '/tmp/test_file_sym.txt', 'path');
    test.equal(file.realpath, process.cwd() + '/tmp/test_file.txt', 'realpath');
    test.strictEqual(file.isDirectory, false, 'isDirectory');
    test.strictEqual(file.isSymlinkedDirectory, false, 'isSymlinkedDirectory');
    test.strictEqual(file.isSymbolicLink, true, 'isSymbolicLink');
    test.strictEqual(file.isFile, true, 'isFile');
    test.strictEqual(file.isSymlinkedFile, true, 'isSymlinkedFile');
    test.done();
  },

  directory(test) {
    var dir = new FsNode('tmp/sub');
    test.equal(dir.path, process.cwd() + '/tmp/sub', 'path');
    test.equal(dir.realpath, dir.path, 'realpath');
    test.equal(dir.relativePath, 'tmp/sub', 'relativePath');
    test.equal(dir.dirname, process.cwd() + '/tmp', 'dirname');
    test.equal(dir.relativeDirname, 'tmp', 'relativeDirname');
    test.equal(dir.basename, 'sub', 'basename');
    test.strictEqual(dir.extname, '', 'extname');
    test.strictEqual(dir.isSymlinkedDirectory, false, 'isSymlinkedDirectory');
    test.strictEqual(dir.isDirectory, true, 'isDirectory');
    test.strictEqual(dir.isSymbolicLink, false, 'isSymbolicLink');
    test.strictEqual(dir.isFile, false, 'isFile');
    test.strictEqual(dir.isSymlinkedFile, false, 'isSymlinkedFile');
    test.done();
  },

  symlinkedDirectory(test) {
    var dir = new FsNode('tmp/sub_sym');
    test.equal(dir.path, process.cwd() + '/tmp/sub_sym', 'path');
    test.equal(dir.realpath, process.cwd() + '/tmp/sub', 'realpath');
    test.equal(dir.relativePath, 'tmp/sub_sym', 'relativePath');
    test.equal(dir.dirname, process.cwd() + '/tmp', 'dirname');
    test.equal(dir.relativeDirname, 'tmp', 'relativeDirname');
    test.equal(dir.basename, 'sub_sym', 'basename');
    test.strictEqual(dir.extname, '', 'extname');
    test.strictEqual(dir.isSymlinkedDirectory, true, 'isSymlinkedDirectory');
    test.strictEqual(dir.isDirectory, true, 'isDirectory');
    test.strictEqual(dir.isSymbolicLink, true, 'isSymbolicLink');
    test.strictEqual(dir.isFile, false, 'isFile');
    test.strictEqual(dir.isSymlinkedFile, false, 'isSymlinkedFile');
    test.done();
  },
  
  nonexistant (test) {
    test.throws(() => new FsNode('noooon_existant_file'), null, 'file must exist');
    test.done();
  },

  iterable (test) {
    var tree = new FsNode('tmp');
    var iterated = [];
    
    for(let entry of tree) {
      iterated.push(entry.relativePath);
    }
    
    test.deepEqual(paths, iterated, 'must iterate file');
    test.done();
  },

  iterableRecursively (test) {
    var tree = new FsNode('tmp');
    var iterated = [];
    
    for(let entry of tree.all) {
      iterated.push(entry.relativePath);
    }
    
    test.deepEqual(allPaths, iterated, 'must iterate file');
    test.done();
  },

  paths (test) {
    var tree = new FsNode('tmp');
    test.deepEqual(paths, tree.paths, 'must iterate file');
    test.done();
  },

  allPaths (test) {
    var tree = new FsNode('tmp');
    test.deepEqual(allPaths, tree.allPaths, 'must iterate file');
    test.done();
  },
  
  invalidate (test) {
    var tree = new FsNode('tmp');
    
    tree.cache.clear(); // empty before test
    tree.cache.set('someKey', 1);
    tree.cache.set('someKey2', 2);
    tree.cache.set('someKey3', 3);
    test.strictEqual(tree.invalidate('someKey'), tree, 'must return same instance');
    test.strictEqual(tree.cache.get('someKey'), undefined, 'must clear cached key');
    test.strictEqual(tree.cache.size, 2, 'must clear only the cached key');
    test.strictEqual(tree.invalidate(), tree, 'must return same instance');
    test.strictEqual(tree.cache.size, 0, 'must clear cache');
    test.throws(() => tree.invalidate(true), 0, 'throws and error if invalid key');
    test.done();
  },
  
  cachedKeys (test) {
    var tree = new FsNode('tmp');
    tree.cache.clear();
    FsNode.realpaths.set(tree.path, 'blablalba')
    test.strictEqual(tree.realpath, 'blablalba', 'must return cached realpath');
    FsNode.realpaths.delete(tree.path);
    test.strictEqual(tree.realpath, tree.path, 'must lookup path');
    test.done();
  },

  toString (test) {
    var node = new FsNode('tmp');
    test.equal(`${node.path}`, node.path,'toString');
    test.equal(node.toString(), node.path,'toString');
    test.done();
  }
}
