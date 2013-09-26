containerMaker = require './containerModule.coffee'
renderer = require '../renderer/renderer.coffee'

# Create the image material
createImageMaterial = (url) ->

  # Get the image utilities so that we can set the crossOrigin value.
  utils =  THREE.ImageUtils
  utils.crossOrigin = 'anonymous'

  # Create the texture asynchronously from a url.
  texture = utils.loadTexture url, new THREE.UVMapping(), ->
    # On load, update the texture and rerender.
    texture.needsUpdate = true
    renderer.render()

  # Create a new material with the texture upon it and
  material = new THREE.MeshBasicMaterial {map: texture, side: THREE.DoubleSide}
  material.map.needsUpdate = true

  # return that material.
  material

# Create the image on it's own container block and return that block.
module.exports = imageMaker = (node) ->
  material = createImageMaterial node.tag
  containerMaker node, material