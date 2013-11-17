var express = require("express")
  , bowerProxy = require('./bower-proxy')
  , domain = require('domain');

var app = express();
app.use(express.logger());

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });
});

app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/install/:package', function(req, res) {
  var d = domain.create();
  d.on('error', function(err) {
    res.writeHead(500);
    res.end(err);
  });
  d.run(function() {
    bowerProxy.get([req.param('package')], function(filename, error) {
      if(error) throw error;
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachement; filename='+req.param('package')+'.zip');
      res.send(filename);
    });
  });
});

app.get('/install/:package/:version', function(req, res) {
  var d = domain.create();
  d.on('error', function(err) {
    res.writeHead(500);
    res.end(err.message);
  });
  d.run(function() {
    bowerProxy.get([req.param('package') + '#' + req.param('version')], function(filename, error) {
      if(error) throw error;
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachement; filename='+req.param('package')+'.zip');
      res.send(filename);
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
