(function() {
  var getTextElem, makeLookUp, makeText;

  makeLookUp = function(text, fontSize) {
    var canvas, character, context, face, hash, letter, quad, texture, _i, _len;
    hash = {};
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      character = text[_i];
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      canvas.width = (context.measureText(character)).width + 3;
      canvas.height = fontSize * 1.5;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = fontSize + 'px monospace';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '0xFFFFFFF';
      context.fillText(character, canvas.width / 2 + 0.3, canvas.height / 2);
      texture = new THREE.Texture(canvas);
      face = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      quad = new THREE.PlaneGeometry(canvas.width, canvas.height);
      letter = new THREE.Mesh(quad, face);
      texture.needsUpdate = true;
      hash[character] = letter;
    }
    return hash;
  };

  makeText = function(text, hash, maxWidth, maxHeight) {
    var character, eachLetter, group, letter, line, xPos, yPos, _i, _j, _len, _len1, _ref;
    group = new THREE.Object3D();
    line = new THREE.Object3D();
    yPos = 0;
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      character = text[_i];
      if (!(Math.abs(yPos < maxHeight))) {
        continue;
      }
      xPos = 0;
      letter = new THREE.Mesh(hash[character].geometry, hash[character].material);
      _ref = line.children;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        eachLetter = _ref[_j];
        xPos += eachLetter.geometry.width + 5;
      }
      letter.position.x = xPos;
      line.position.x = -xPos / 2;
      if (xPos > maxWidth) {
        line.add(letter);
        xPos = 0;
        yPos -= fontSize * 1.5;
        line.position.y = yPos;
        group.add(line);
        line = new THREE.Object3D();
      } else {
        line.add(letter);
      }
    }
    yPos -= fontSize * 1.5;
    line.position.y = yPos;
    group.add(line);
    group.position.y = Math.abs(yPos / 2);
    return group;
  };

  getTextElem = function(text, fontSize, maxWidth, maxHeight, depth) {
    var table, textElem;
    table = makeLookUp(text, fontSize);
    textElem = makeText(text, table, maxWidth, maxHeight);
    textElem.traslateZ(depth);
    return textElem;
  };

}).call(this);
