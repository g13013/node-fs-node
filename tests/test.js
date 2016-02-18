var nodeunit = require('nodeunit');
var runner = nodeunit.reporters.default;
var rm = require('rimraf').sync;
var fs = require('fs');

function createFixtures () {
  if (fs.existsSync('tmp')) {
    rm('tmp');
  }

  fs.mkdirSync('tmp');
  fs.mkdirSync('tmp/sub');
  fs.writeFileSync('./tmp/sub/test_file.txt', 'sub tmp test file');
  fs.writeFileSync('./tmp/test_file.txt', 'tmp test file');
  fs.symlinkSync(process.cwd() + '/tmp/test_file.txt', process.cwd() + '/tmp/test_file_sym.txt');
  fs.symlinkSync(process.cwd() + '/tmp/sub', process.cwd() + '/tmp/sub_sym');
}

function clean () {
  rm('tmp');
}

createFixtures()
runner.run([
  'tests/spec/fs_node.js'
], null, () => clean());
