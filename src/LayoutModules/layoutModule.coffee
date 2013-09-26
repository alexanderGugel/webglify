texter = require '../ConstructorModules/textModule.coffee'
imager = require '../ConstructorModules/imgModule.coffee'
container = require '../ConstructorModules/containerModule.coffee'

# the layout maker finally goes through and renders each dressed node in the syntax tree. Also creates the camera.
module.exports = layoutMaker = (syntax) ->

  # set the width and height for the camera aspect ratio to the width and height of the root node of the syntax. The renderer will use the same values.
  width = syntax.options.width
  height = syntax.options.height

  # default properties for the camera.
  viewAngle = 45
  aspect = width/height
  near = 0.1
  far = 10000

  # create the camera.
  camera = new THREE.PerspectiveCamera viewAngle, aspect, near, far
  # create the scene.
  scene = new THREE.Scene()
  # set the camera position. 800 is an arbitrary value. TODO: figure out an appropriate Z value for the camera based on the size of the renderer.
  camera.position.set 0, 0, 800

  # recursively traverse the syntax tree and add every rendered node to the scene. Set the stage!
  recursiveStager = (node) ->
    # handle each case.
    if node.options.type is 'text'
      scene.add texter node
    else if node.options.type is 'block'
      scene.add container node
    else if node.options.type is 'image'
      scene.add imager node
    # recurse through the tree.
    recursiveStager child for child in node.children

  # start the stager.
  recursiveStager syntax

  # return the scene and the camera
  options =
    scene: scene,
    camera: camera