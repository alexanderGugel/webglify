/*
 * WebGlify
 * https://github.com/DnMllr/webglify
 *
 * Copyright (c) 2013 Daniel Miller
 * Licensed under the MIT license.
*/


(function() {
  var WebGlify, dresser, layout;

  dresser = require('../compiler/dresser.js');

  layout = require('../LayoutModules/layoutModule.js');

  module.exports = WebGlify = function(syntax) {
    return layout(dresser(syntax));
  };

}).call(this);
