module.exports = containerMaker = (node, material) ->
  planeMaterial = material ? new THREE.MeshBasicMaterial {color: node.options.backgroundColor, side: THREE.DoubleSide}
  planeGeometry = new THREE.PlaneGeometry node.options.width, node.options.height, 1, 1
  plane = new THREE.Mesh planeGeometry, planeMaterial
  plane.position.y = node.options.y
  plane.position.x = node.options.x
  plane.position.z = node.options.z
  plane