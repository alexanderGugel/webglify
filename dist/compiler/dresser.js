(function() {
  var dresser;

  module.exports = dresser = function(syntax) {
    var child, index, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base20, _base21, _base22, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref;
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
    if ((_base5 = syntax.options).backgroundColor == null) {
      _base5.backgroundColor = '#FFFFFF';
    }
    if ((_base6 = syntax.options).childType == null) {
      _base6.childType = 'vertical';
    }
    _ref = syntax.children;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      child = _ref[index];
      child.options.type = syntax.options.childType !== 'horizontal' || syntax.options.childType !== 'vertical' ? syntax.options.childType : 'block';
      if ((_base7 = child.options)._parentX == null) {
        _base7._parentX = syntax.options.x;
      }
      if ((_base8 = child.options)._parentY == null) {
        _base8._parentY = syntax.options.y;
      }
      switch (syntax.options.childType) {
        case 'horizontal':
          if (syntax.children[index - 1] != null) {
            if ((_base9 = child.options).x == null) {
              _base9.x = syntax.children[index - 1].options.width;
            }
          } else {
            if ((_base10 = child.options).x == null) {
              _base10.x = syntax.options.x;
            }
          }
          if ((_base11 = child.options).y == null) {
            _base11.y = syntax.options.y;
          }
          if ((_base12 = child.options).width == null) {
            _base12.width = syntax.options.width / syntax.children.length;
          }
          if ((_base13 = child.options).height == null) {
            _base13.height = syntax.options.height;
          }
          break;
        case 'vertical':
          if (syntax.children[index - 1] != null) {
            if ((_base14 = child.options).y == null) {
              _base14.y = syntax.children[index - 1].options.height;
            }
          } else {
            if ((_base15 = child.options).y == null) {
              _base15.y = syntax.options.y;
            }
          }
          if ((_base16 = child.options).x == null) {
            _base16.x = syntax.options.x;
          }
          if ((_base17 = child.options).height == null) {
            _base17.height = syntax.options.height / syntax.children.length;
          }
          if ((_base18 = child.options).width == null) {
            _base18.width = syntax.options.width;
          }
          break;
        case 'image':
        case 'text':
          if ((_base19 = child.options).x == null) {
            _base19.x = syntax.options.x;
          }
          if ((_base20 = child.options).y == null) {
            _base20.y = syntax.options.y;
          }
          if ((_base21 = child.options).width == null) {
            _base21.width = syntax.options.width;
          }
          if ((_base22 = child.options).height == null) {
            _base22.height = syntax.options.height;
          }
          break;
        case 'image':
          if (child.tag.slice(0, 7 !== 'http://')) {
            child.tag = 'http://'.concat(child.tag);
          }
      }
      dresser(child);
    }
    return syntax;
  };

}).call(this);
