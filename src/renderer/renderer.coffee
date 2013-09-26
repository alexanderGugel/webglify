module.exports =
  render: (width, height)->
    @renderer.setSize width ? document.body.scrollWidth, height ? document.body.scrollHeight
    @renderer.render(@scene, @camera)
  init: (scene, camera) ->
    renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
    renderer.setSize document.body.scrollWidth, document.body.scrollHeight
    scene.add camera
    @renderer = renderer
    @scene = scene
    @camera = camera
    @domElement = renderer.domElement