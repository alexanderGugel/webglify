(function() {
  var HTMLparser, findElementsByType, htmlparse;

  htmlparse = require('htmlparser');

  findElementsByType = function(type, element) {
    var recurseSearch, results;
    results = [];
    recurseSearch = function(type, element) {
      var node, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = element.length; _i < _len; _i++) {
        node = element[_i];
        if (node.type === type) {
          results.push(node.data);
        }
        if (node.children) {
          _results.push(recurseSearch(type, node.children));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    recurseSearch(type, element);
    return results;
  };

  HTMLparser = (function() {
    function HTMLparser(type) {
      this.type = type;
    }

    HTMLparser.prototype.parse = function(html) {
      var handler, parser;
      handler = new htmlparse.DefaultHandler(function(error, dom) {
        if (error) {
          return console.log('error');
        } else {
          this.divs = findElementsByType('div', dom);
          return this.text = findElementsByType('text', dom);
        }
      });
      parser = new htmlparse.Parser(handler);
      parser.parseComplete(html);
      return {
        div: handler.divs,
        text: handler.text
      };
    };

    return HTMLparser;

  })();

  module.exports = HTMLparser;

}).call(this);
