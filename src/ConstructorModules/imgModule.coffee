containerMaker = require './containerModule.coffee'
renderer = require '../renderer/renderer.coffee'

createImageMaterial = (url) ->
  texture = THREE.ImageUtils.loadTexture url, new THREE.UVMapping(), ->
    texture.needsUpdate = true
    renderer.render()
  material = new THREE.MeshBasicMaterial {map: texture, side: THREE.DoubleSide}
  material

module.exports = imageMaker = (node) ->
  material = createImageMaterial node.tag
  containerMaker node, material