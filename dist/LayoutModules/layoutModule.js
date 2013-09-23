(function() {
  var container, imager, layoutMaker, texter;

  texter = require('../ConstructorModules/textModule.js');

  imager = require('../ConstructorModules/imgModule.js');

  container = require('../ConstructorModules/containerModule.js');

  module.exports = layoutMaker = function(syntax) {
    var aspect, camera, far, height, near, recursiveRenderer, renderer, scene, viewAngle, width;
    width = syntax.options.width;
    height = syntax.options.height;
    viewAngle = 45;
    aspect = width / height;
    near = 0.1;
    far = 10000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    scene = new THREE.Scene();
    scene.add(camera);
    camera.position.z = 300;
    recursiveRenderer = function(node) {
      var child, _i, _len, _ref, _results;
      switch (syntax.options.type) {
        case 'image':
          scene.add(imager(node));
          break;
        case 'text':
          scene.add(texter(node));
          break;
        case 'block':
          scene.add(container(node));
      }
      _ref = node.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(recurser(child));
      }
      return _results;
    };
    recursiveRenderer(syntax);
    return scene;
  };

}).call(this);
