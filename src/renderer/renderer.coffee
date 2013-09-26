# create the renderer
module.exports =

  # the render function rerenders the renderer to a particular size, if given one, or the document's proportions, if not.
  render: (width, height)->
    @renderer.setSize width ? window.document.body.offsetWidth, height ? window.innerHeight, true
    @renderer.render(@scene, @camera)

  # initializer defines the renderer.
  init: (scene, camera, baseWidth, baseHeight) ->
    renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
    renderer.setSize baseWidth ? window.document.body.offsetWidth, baseHeight ? window.innerHeight
    scene.add camera
    @renderer = renderer
    @scene = scene
    @camera = camera
    @domElement = renderer.domElement