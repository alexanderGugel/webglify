(function() {
  var app, getElementsByTagName, io, jsdom, server, url;

  app = require('express')();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  url = require('url');

  jsdom = require('jsdom');

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
      queryUrl = url.parse(data);
      return jsdom.env({
        url: queryUrl.href,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: function(errors, window) {
          var text;
          text = getElementsByTagName(window.document);
          return console.log(text);
        }
      });
    });
  });

  getElementsByTagName = function(el) {
    var element, elements, results, _i, _len;
    elements = el.getElementsByTagName('p');
    results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      console.log(element);
      console.log(element.childNodes[0]);
      results.push(element.childNodes[0].nodeValue);
    }
    return elements;
  };

}).call(this);
