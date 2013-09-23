(function() {
  var app, io, parser, server, url, webglify;

  app = require('express')();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  url = require('url');

  parser = require('../parsers/webglifyPARSER.js');

  webglify = require('../app/webglify.js');

  server.listen(8080);

  app.get('/', function(req, res) {
    return res.sendfile(__dirname + '/index.html');
  });

  io.sockets.on('connection', function(socket) {
    socket.emit('news', {
      hello: 'world'
    });
    return socket.on('submit', function(data) {
      return webglify(parser(data));
    });
  });

}).call(this);
