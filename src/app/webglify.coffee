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


window.WebGlify = (data) ->
  value = data.data
  scene = layout dresser parser value
  renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
  renderer.setSize window.innerWidth+10, window.innerHeight+10
  document.body.appendChild renderer.domElement
  renderer.render scene.scene, scene.camera