var express = require("express")
  , bowerProxy = require('./bower-proxy');

var app = express();
app.use(express.logger());

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/public');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/install/:package', function(req, res) {
  bowerProxy.get([req.param('package')], function(filename) {
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachement; filename='+req.param('package')+'.zip');
    res.send(filename);
  }, function(error) {
    res.writeHead(500);
    res.end(error);
  });
});

app.get('/install/:package/:version', function(req, res) {
  bowerProxy.get([req.param('package') + '#' + req.param('version')], function(filename) {
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachement; filename='+req.param('package')+'.zip');
    res.send(filename);
  }, function(error) {
    res.writeHead(500);
    res.end(error);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
