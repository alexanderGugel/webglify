(function() {
  var dresser;

  module.exports = dresser = function(syntax) {
    var child, index, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref, _results;
    if ((_base = syntax.options).x == null) {
      _base.x = -window.innerwidth / 2;
    }
    if ((_base1 = syntax.options).y == null) {
      _base1.y = -window.innerheight / 2;
    }
    if ((_base2 = syntax.options).z == null) {
      _base2.z = syntax.options.depth;
    }
    if ((_base3 = syntax.options).height == null) {
      _base3.height = window.innerheight;
    }
    if ((_base4 = syntax.options).width == null) {
      _base4.width = window.innerwidth;
    }
    if ((_base5 = syntax.options).backgroundcolor == null) {
      _base5.backgroundcolor = '#FFFFFF';
    }
    if ((_base6 = syntax.options).childType == null) {
      _base6.childType = 'vertical';
    }
    _ref = syntax.children;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      child = _ref[index];
      if ((_base7 = child.options)._parentType == null) {
        _base7._parentType = syntax.options.childType;
      }
      if ((_base8 = child.options)._parentX == null) {
        _base8._parentX = syntax.options.x;
      }
      if ((_base9 = child.options)._parentY == null) {
        _base9._parentY = syntax.options.y;
      }
      if (syntax.options.childType === 'horizontal') {
        if (syntax.children[index - 1] != null) {
          if ((_base10 = child.options).x == null) {
            _base10.x = syntax.children[index - 1].options.width;
          }
        } else {
          if ((_base11 = child.options).x == null) {
            _base11.x = syntax.options.x;
          }
        }
        if ((_base12 = child.options).y == null) {
          _base12.y = syntax.options.y;
        }
        if ((_base13 = child.options).width == null) {
          _base13.width = syntax.options.width / syntax.children.length;
        }
        if ((_base14 = child.options).height == null) {
          _base14.height = syntax.options.height;
        }
      }
      if (syntax.options.childType === 'vertical') {
        if (syntax.children[index - 1] != null) {
          if ((_base15 = child.options).y == null) {
            _base15.y = syntax.children[index - 1].options.height;
          }
        } else {
          if ((_base16 = child.options).y == null) {
            _base16.y = syntax.options.y;
          }
        }
        if ((_base17 = child.options).x == null) {
          _base17.x = syntax.options.x;
        }
        if ((_base18 = child.options).height == null) {
          _base18.height = syntax.options.height / syntax.children.length;
        }
        if ((_base19 = child.options).width == null) {
          _base19.width = syntax.options.width;
        }
      }
      _results.push(dresser(child));
    }
    return _results;
  };

}).call(this);
