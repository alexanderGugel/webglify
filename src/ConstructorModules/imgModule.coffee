containerMaker = require './containerModule.coffee'
renderer = require '../renderer/renderer.coffee'

createImageMaterial = (url) ->
  utils =  THREE.ImageUtils
  utils.crossOrigin = 'anonymous'
  texture = utils.loadTexture url, new THREE.UVMapping(), ->
    texture.needsUpdate = true
    renderer.render()
  material = new THREE.MeshBasicMaterial {map: texture, side: THREE.DoubleSide}
  material.map.needsUpdate = true
  material

module.exports = imageMaker = (node) ->
  material = createImageMaterial node.tag
  containerMaker node, material