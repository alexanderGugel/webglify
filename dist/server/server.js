(function() {
  var HTMLparser, app, io, jsdom, objectifier, parser, peg, phantom, segmenter, server, url;

  app = require('express')();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  url = require('url');

  jsdom = require('jsdom');

  phantom = require('phantom');

  HTMLparser = require('../parsers/HTMLparser.js');

  peg = require('pegjs');

  server.listen(8080);

  app.get('/', function(req, res) {
    return res.sendfile(__dirname + '/index.html');
  });

  io.sockets.on('connection', function(socket) {
    socket.emit('news', {
      hello: 'world'
    });
    return socket.on('submit', function(data) {
      return socket.emit('return', parser(data));
    });
  });

  parser = function(text) {
    var content, firstNonWhiteSpaceIndex, i, item, line, lines, malformed, option, options, properlyFormed, tagSpace, whitespace, _i, _j, _k, _len, _len1, _ref;
    lines = text.split('\n');
    malformed = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      firstNonWhiteSpaceIndex = line.indexOf(/\S/.exec(line));
      whitespace = line.slice(0, firstNonWhiteSpaceIndex);
      if (line.indexOf(':') !== -1) {
        tagSpace = line.slice(firstNonWhiteSpaceIndex, line.indexOf(':'));
        options = line.slice(line.indexOf(':') + 1).replace(/\s/g, '');
        options = options.split(',');
        options = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = options.length; _j < _len1; _j++) {
            option = options[_j];
            _results.push(option.split(':'));
          }
          return _results;
        })();
        malformed.push([whitespace.length, tagSpace, options]);
      } else {
        content = line.slice(firstNonWhiteSpaceIndex);
        malformed.push([whitespace.length, content, []]);
      }
    }
    for (i = _j = 1, _ref = malformed.length - 1; 1 <= _ref ? _j <= _ref : _j >= _ref; i = 1 <= _ref ? ++_j : --_j) {
      if (malformed[i][1].length === 0 && malformed[i - 1][2].length === 0 && malformed[i][0] === malformed[i - 1][0]) {
        malformed[i - 1][2] = malformed[i - 1][2].concat(malformed[i][2]);
      }
    }
    properlyFormed = [];
    for (_k = 0, _len1 = malformed.length; _k < _len1; _k++) {
      item = malformed[_k];
      if (item[1].length !== 0) {
        properlyFormed.push(objectifier(item));
      }
    }
    return segmenter(properlyFormed);
  };

  objectifier = function(element) {
    var object, option, _i, _len, _ref;
    object = {
      depth: element[0],
      tag: element[1],
      options: {},
      children: []
    };
    _ref = element[2];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      object.options[option[0]] = option[1];
    }
    return object;
  };

  segmenter = function(array) {
    var element, i, lastValue, m, temp, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2, _ref3;
    array = [array];
    m = 0;
    while (array[m] != null) {
      temp = [];
      _ref = array[m];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        lastValue = array[m].length;
        for (i = _j = _ref1 = array[m].length - 1; _j >= 0; i = _j += -1) {
          if (element.depth === array[m][i].depth) {
            temp.unshift(array[m].slice(i, lastValue));
            lastValue = i;
          }
        }
      }
      console.log('temp is ', temp);
      array[m] = temp;
      m++;
    }
    for (_k = 0, _len1 = array.length; _k < _len1; _k++) {
      element = array[_k];
      for (i = _l = _ref2 = element.length - 1; _l >= 1; i = _l += -1) {
        element[i - 1].children.push(element[i].pop());
      }
    }
    console.log(array);
    for (i = _m = _ref3 = array.length - 1; _m >= 1; i = _m += -1) {
      array[i - 1].children.push(array[i]);
    }
    return array[0];
  };

}).call(this);
