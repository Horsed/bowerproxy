var bower = require('bower')
  , mkdirp = require('mkdirp')
  , uuid = require('node-uuid')
  , fs = require('fs')
  , AdmZip = require('adm-zip');

module.exports = {
  get: function(packageName, fn, errFn) {
    var tmpDir = uuid.v1();

    bower.commands
    .search(packageName, {})
    .on('end', function (results) {
      if(results.length > 0) {
        bower.commands
        .install(packageName, {save:false}, {cwd: "output/" + tmpDir, directory: "bower_components"})
        .on('end', function(installed) {

          var zip = new AdmZip();
          zip.addLocalFolder('output/' + tmpDir + '/bower_components');
          zip.writeZip('output/' + tmpDir + '/' + packageName + '.zip');

          fn(zip.toBuffer());

          deleteFolderRecursive('output/' + tmpDir);
        })
        .on('error', function(err) {
          errFn(err);
        });
      } else {
        errFn('package ' + packageName + ' not found');
      }
    });

  }
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
