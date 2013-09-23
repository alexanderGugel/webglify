containerMaker = () ->
  planeMaterial = new THREE.MeshBasicMaterial {color: 'white', side: THREE.DoubleSide}
  planeGeometry = new THREE.PlaneGeometry 100,100,1,1
  plane = new THREE.Mesh planeGeometry, planeMaterial
  plane.position.y = -0.5
  plane.rotation.x = 45*(Math.Pi / 180)