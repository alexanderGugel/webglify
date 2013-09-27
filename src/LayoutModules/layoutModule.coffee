texter = require '../ConstructorModules/textModule.coffee'
imager = require '../ConstructorModules/imgModule.coffee'
container = require '../ConstructorModules/containerModule.coffee'
layout =


  layoutMaker: (syntax) ->

    # set the width and height for the camera aspect ratio to the width and height of the root node of the syntax. The renderer will use the same values.
    width = syntax.options.width
    height = syntax.options.height

    # default properties for the camera.
    viewAngle = 45
    aspect = width/height
    near = 0.1
    far = 10000
  
    # create the camera.
    @camera = new THREE.PerspectiveCamera viewAngle, aspect, near, far

    # create the scene.
    @scene = new THREE.Scene()

    # instantiate node list.
    @nodes =
      images: []
      text: []
      containers: []
      all: []

    # set the camera position. 800 is an arbitrary value. TODO: figure out an appropriate Z value for the camera based on the size of the renderer.
    @camera.position.set 0, 0, 800

    # start the stager.
    @recursiveStager syntax

    # return the scene and the camera
    options =
      scene: @scene,
      camera: @camera
      nodes: @nodes

  # recursively traverse the syntax tree and add every rendered node to the scene. Set the stage!
  recursiveStager: (node) ->
    # handle each case.
    if node.options.type is 'text'
      threejsElm = texter node
      location = 'text'
    else if node.options.type is 'image'
      threejsElm = imager node
      location = 'images'
    else
      threejsElm = container node
      location = 'containers'
    # give the element a name
    threejsElm.name = "#{node.options.type ? node.tag}: " + node.depth + ':' + Math.floor(Math.random()*899 + 100)
    # add the element where it is needed
    @nodes[location].push threejsElm
    @nodes.all.push threejsElm
    @scene.add threejsElm
    # recurse through the tree.
    @recursiveStager child for child in node.children


# the layout maker finally goes through and renders each dressed node in the syntax tree. Also creates the camera.
module.exports = layout