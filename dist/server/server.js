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
      var value, x, y;
      value = data.data;
      x = data.windowSize[0];
      y = data.windowSize[1];
      return webglify(parser(value, x, y));
    });
  });

}).call(this);
