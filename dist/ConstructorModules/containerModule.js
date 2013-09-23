(function() {
  var containerMaker;

  containerMaker = function() {
    var plane, planeGeometry, planeMaterial;
    planeMaterial = new THREE.MeshBasicMaterial({
      color: 'white',
      side: THREE.DoubleSide
    });
    planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -0.5;
    return plane.rotation.x = 45 * (Math.Pi / 180);
  };

}).call(this);
