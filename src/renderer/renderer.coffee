module.exports =
  render: ()->
    @renderer.render(@scene, @camera)
  init: (scene, camera) ->
    renderer = new THREE.WebGLRenderer {antialias: true, precision: 'highp'}
    renderer.setSize window.innerWidth+10, window.innerHeight+10
    scene.add camera
    @renderer = renderer
    @scene = scene
    @camera = camera
    @domElement = renderer.domElement