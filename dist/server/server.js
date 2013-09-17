(function() {
  var HTMLparser, app, io, jsdom, phantom, server, url;

  app = require('express')();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  url = require('url');

  jsdom = require('jsdom');

  phantom = require('phantom');

  HTMLparser = require('../parsers/HTMLparser.js');

  server.listen(8080);

  app.get('/', function(req, res) {
    return res.sendfile(__dirname + '/index.html');
  });

  io.sockets.on('connection', function(socket) {
    socket.emit('news', {
      hello: 'world'
    });
    return socket.on('submit', function(data) {
      var queryUrl;
      console.log('hello!');
      console.log('heeello!');
      console.log('heeeeello!');
      queryUrl = url.parse(data);
      return phantom.create(function(ph) {
        return ph.createPage(function(page) {
          return page.open(queryUrl, function(status) {});
        });
      });
    });
  });

}).call(this);
