'use strict';

/*eslint-disable no-unused-vars*/

var walk = require('../walkfs');
var fs = require('fs');
var path = require('path');
var FsNode = require(process.cwd());

exports.FsNode = function () {
  var files = new FsNode(process.cwd());
  for (var file of files) {
    var dir = file.isDirectory;
    var isSymbolicLink = file.isSymbolicLink;
    var lstat = file.lstat;
    var realpath = file.realpath;
    var p = file.path;
  }
}

exports.Simple = function() {
  var files = walk(process.cwd());
  for (var i = 0; i < files.length; i++) {
    var dir = fs.statSync(files[i]).isDirectory();
    var lstat = fs.lstatSync(files[i]);
    var isSymbolicLink = lstat.isSymbolicLink();
    var realpath = fs.realpath(files[i]);
    var p = path.resolve(files[i]);
  }
}
