texter = require '../ConstructorModules/textModule.coffee'
imager = require '../ConstructorModules/imgModule.coffee'
container = require '../ConstructorModules/containerModule.coffee'

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
  camera.position.set 0, 0, (window.innerWidth*2)/3
  recursiveStager = (node) ->
    if node.options.type is 'text'
      scene.add texter node
    else if node.options.type is 'block'
      scene.add container node
    else if node.options.type is 'image'
      scene.add imager node
    recursiveStager child for child in node.children
  recursiveStager syntax
  object =
    scene: scene,
    camera: camera
  object