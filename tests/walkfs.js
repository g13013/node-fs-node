'use strict';

var fs = require('fs');

module.exports = function walk(root, recursive, tree) {
  tree = tree || [];

  var entries = fs.readdirSync(root);
  for (let filename of entries) {
    var rel = `${root}/${filename}`;
    tree.push(rel);

    if (recursive) {
      if (fs.statSync(rel).isDirectory()) {
        walk(rel, recursive, tree);
      }
    }
  }
  
  return tree;
}
