containerMaker = require './containerModule.coffee'

createImageMaterial = (url) ->
  img = new Image()
  console.log url
  img.src = url
  img.onload = ->
    texture = new THREE.Texture(img)
    texture.needsUpdate = true
    material = new THREE.MeshLambertMaterial {map: texture}
    texture.needsUpdate = true
    return material

module.exports = imageMaker = (node) ->
  containerMaker node, createImageMaterial node.tag