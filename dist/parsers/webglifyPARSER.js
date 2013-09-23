(function() {
  var inheriter, objectifier, parser, segmenter;

  module.exports = parser = function(text) {
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
    return inheriter(segmenter(properlyFormed));
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
    var recurser, results;
    results = [];
    recurser = function(array2) {
      var element, i, index, _i, _j, _len, _ref, _ref1;
      for (index = _i = 0, _len = array2.length; _i < _len; index = ++_i) {
        element = array2[index];
        for (i = _j = _ref = array2.length - 1, _ref1 = index + 1; _j >= _ref1; i = _j += -1) {
          if (element.depth === array2[i].depth) {
            recurser(array2.slice(i));
            recurser(array2.slice(0, i));
            return false;
          }
        }
      }
      return results.unshift(array2);
    };
    recurser(array);
    return results;
  };

  inheriter = function(array) {
    var child, index, j, lostChild, parent, potentialSibling, subArray, _i, _j, _k, _l, _len, _len1, _len2, _ref;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      subArray = array[_i];
      for (j = _j = _ref = subArray.length - 1; _j >= 1; j = _j += -1) {
        child = subArray[j];
        parent = subArray[j - 1];
        parent.children.push(child);
      }
    }
    for (index = _k = 0, _len1 = array.length; _k < _len1; index = ++_k) {
      subArray = array[index];
      if (!(index !== array.length - 1)) {
        continue;
      }
      lostChild = array[index + 1][0];
      for (index = _l = 0, _len2 = subArray.length; _l < _len2; index = ++_l) {
        potentialSibling = subArray[index];
        if (potentialSibling.depth === lostChild.depth) {
          subArray[index - 1].children.push(lostChild);
        }
      }
    }
    return array[0][0];
  };

}).call(this);
