# create the renderer
module.exports =

  # the render function rerenders the renderer to a particular size, if given one, or the document's proportions, if not.
  render: (width, height)->
    @renderer.setSize width ? window.innerWidth, height ? window.innerHeight, true
    @renderer.render(@scene, @camera)

  # initializer defines the renderer.
  init: (scene, camera, baseWidth, baseHeight) ->
    renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
    renderer.setSize baseWidth ? window.innerWidth, baseHeight ? window.innerHeight
    scene.add camera
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.margin = 0
    @renderer = renderer
    @scene = scene
    @camera = camera
    @domElement = renderer.domElement