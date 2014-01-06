var bower = require('bower')
  , domain = require('domain')
  , mkdirp = require('mkdirp')
  , uuid = require('node-uuid')
  , fs = require('fs')
  , AdmZip = require('adm-zip');

module.exports = {
  get: function(packageName, fn, errFn) {
    var d = domain.create();
    d.on('error', function(err) {
      errFn(err);
    });

    var search = bower.commands.search(packageName[0], {});

    d.add(search);

    d.run(function() {
      var tmpDir = uuid.v1();

      search.on('end', function (results) {
        if(results.length > 0) {

          var d = domain.create();
          d.on('error', function(err) {
            errFn(err);
          });
          var install = bower.commands.install(packageName, {save:false}, {cwd: "output/" + tmpDir, directory: "bower_components"});

          d.add(install);

          d.run(function() {
            install.on('end', function(installed) {

              var zip = new AdmZip();
              zip.addLocalFolder('output/' + tmpDir + '/bower_components');
              zip.writeZip('output/' + tmpDir + '/' + packageName + '.zip');

              fn(zip.toBuffer());

              deleteFolderRecursive('output/' + tmpDir);
            });
          });
        } else {
          errFn('package ' + packageName + ' not found');
        }
      });
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
