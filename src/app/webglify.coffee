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

# create our WebGlify Function
module.exports = WebGlify = (data, baseWidth, baseHeight) ->

  # block is our WebGLify code
  block = data

  #  scene is the THREE.JS scene that is created by our modules
  scene = layout dresser (parser block), baseWidth, baseHeight

  #  Initializing our renderer
  renderer.init scene.scene, scene.camera, baseWidth, baseHeight

  # return the WebGLify Object
  WebGlifyObj =
    renderer: renderer
    render: (width, height)->
      renderer.render width, height
    node: renderer.domElement
    scene: scene



#  Direct access to the WebGLify function now depricated, may reimpliment later.
# window.WebGlifyDirect = (data) ->
#   value = data
#   scene = layout dresser parser value
#   renderer.init scene.scene, scene.camera
#   document.body.appendChild renderer.domElement
#   renderer.render()