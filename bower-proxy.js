var bower = require('bower')
  , mkdirp = require('mkdirp')
  , uuid = require('node-uuid')
  , fs = require('fs')
  , AdmZip = require('adm-zip');

var bowerProxy = {
  get: function(packageName, fn) {
    var tmpDir = uuid.v1();

    bower.commands
    .install(packageName, {save:false}, {cwd: "output/" + tmpDir, directory: "bower_components"})
    .on('end', function(installed) {

      var zip = new AdmZip();
      zip.addLocalFolder('output/' + tmpDir + '/bower_components');
      zip.writeZip('output/' + tmpDir + '/' + packageName + '.zip');

      fn('output/' + tmpDir + '/' + packageName + '.zip');
    })
    .on('error', function(err) {
      fn('', err);
    });
  }
};

module.exports = bowerProxy;