# create the renderer
module.exports =

  # the render function rerenders the renderer to a particular size, if given one, or the document's proportions, if not.
  render: (width, height)->
    @renderer.setSize width ? document.body.scrollWidth, height ? document.body.scrollHeight
    @renderer.render(@scene, @camera)

  # initializer defines the renderer.
  init: (scene, camera) ->
    renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
    renderer.setSize document.body.scrollWidth, document.body.scrollHeight
    scene.add camera
    @renderer = renderer
    @scene = scene
    @camera = camera
    @domElement = renderer.domElement