###
 * WebGlify
 * https://github.com/DnMllr/webglify
 *
 * Copyright (c) 2013 Daniel Miller
 * Licensed under the MIT license.
###

dresser = require '../compiler/dresser.coffee'
layout = require '../LayoutModules/layoutModule.coffee'
parser = require '../parsers/webglifyPARSER.coffee'
renderer = require '../renderer/renderer.coffee'


module.exports = WebGlify = (data) ->
  value = data.data
  scene = layout dresser parser value
  renderer.init scene.scene, scene.camera
  document.body.appendChild renderer.domElement
  renderer.render()