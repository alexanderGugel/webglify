# creates a container block.
module.exports = containerMaker = (node, material) ->

  # create a new material if one has not already been provided.
  planeMaterial = material ? new THREE.MeshBasicMaterial {color: node.options.backgroundColor, side: THREE.DoubleSide}

  # create a new geometry.
  planeGeometry = new THREE.PlaneGeometry node.options.width, node.options.height, 1, 1

  # create a new Mesh.
  plane = new THREE.Mesh planeGeometry, planeMaterial

  # position the mesh.
  plane.position.y = node.options.y
  plane.position.x = node.options.x
  plane.position.z = node.options.z

  # return the mesh.
  plane