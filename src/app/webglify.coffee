###
 * WebGlify
 * https://github.com/DnMllr/webglify
 *
 * Copyright (c) 2013 Daniel Miller
 * Licensed under the MIT license.
###

dresser = require '../compiler/dresser.js'
layout = require '../LayoutModules/layoutModule.js'


module.exports = WebGlify = (syntax) ->
  layout dresser syntax