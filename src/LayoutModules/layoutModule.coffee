texter = require '../ConstructorModules/textModule.js'
imager = require '../ConstructorModules/imgModule.js'
container = require '../ConstructorModules/containerModule.js'

module.exports = layoutMaker = (syntax) ->
  width = syntax.options.width
  height = syntax.options.height
  viewAngle = 45
  aspect = width/height
  near = 0.1
  far = 10000
  renderer = new THREE.WebGLRenderer()
  renderer.setSize width, height
  camera = new THREE.PerspectiveCamera viewAngle, aspect, near, far
  scene = new THREE.Scene()
  scene.add camera
  camera.position.z = 300
  recursiveRenderer = (node) ->
    switch syntax.options.type
      when 'image'
        scene.add imager node
      when 'text'
        scene.add texter node
      when 'block'
        scene.add container node
    recurser child for child in node.children
  recursiveRenderer syntax
  scene