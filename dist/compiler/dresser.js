(function() {
  var dresser;

  module.exports = dresser = function(syntax) {
    var child, index, _base, _base1, _base10, _base11, _base12, _base13, _base2, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref, _results;
    if ((_base = syntax.options).x == null) {
      _base.x = -window.innerwidth / 2;
    }
    if ((_base1 = syntax.options).y == null) {
      _base1.y = -window.innerheight / 2;
    }
    if ((_base2 = syntax.options).height == null) {
      _base2.height = window.innerheight;
    }
    if ((_base3 = syntax.options).width == null) {
      _base3.width = window.innerwidth;
    }
    if ((_base4 = syntax.options).backgroundcolor == null) {
      _base4.backgroundcolor = '#FFFFFF';
    }
    if ((_base5 = syntax.options).childtype == null) {
      _base5.childtype = 'vertical';
    }
    _ref = syntax.children;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      child = _ref[index];
      if ((_base6 = child.options)._parentX == null) {
        _base6._parentX = syntax.options.x;
      }
      if ((_base7 = child.options)._parentY == null) {
        _base7._parentY = syntax.options.y;
      }
      if (syntax.options.childType === 'horizontal') {
        if (syntax.children[index - 1] != null) {
          if ((_base8 = child.options).x == null) {
            _base8.x = syntax.children[index - 1].options.width;
          }
        } else {
          if ((_base9 = child.options).x == null) {
            _base9.x = syntax.options.x;
          }
        }
        if ((_base10 = child.options).y == null) {
          _base10.y = syntax.options.y;
        }
      }
      if (syntax.options.childType === 'vertical') {
        if (syntax.children[index - 1] != null) {
          if ((_base11 = child.options).y == null) {
            _base11.y = syntax.children[index - 1].options.height;
          }
        } else {
          if ((_base12 = child.options).y == null) {
            _base12.y = syntax.options.y;
          }
        }
        _results.push((_base13 = child.options).x != null ? (_base13 = child.options).x : _base13.x = syntax.options.x);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

}).call(this);
