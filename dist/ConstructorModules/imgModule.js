(function() {
  var arrayBufferDataUri, containerMaker, createImageMaterial, imageMaker;

  containerMaker = require('./containerModule.js');

  arrayBufferDataUri = function(raw) {
    var a, b, base64, byteLength, byteRemainder, bytes, c, chunk, d, encodings, i, mainLength, _i;
    base64 = '';
    encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    bytes = new Uint8Array(raw);
    byteLength = bytes.byteLength;
    byteRemainder = byteLength % 3;
    mainLength = byteLength - byteRemainder;
    for (i = _i = 0; _i <= mainLength; i = _i += 3) {
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      a = (chunk & 16515072) >> 18;
      b = (chunk & 258048) >> 12;
      c = (chunk & 4032) >> 6;
      d = chunk & 63;
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    if (byteRemainder === 1) {
      chunk = bytes(mainLength);
      a = (chunk & 252) >> 2;
      b = (chunk & 3) << 4;
      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder === 1) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
      a = (chunk & 16128) >> 8;
      b = (chunk & 1008) >> 4;
      c = (chunk & 15) << 2;
      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return "data:image/jpeg;base64," + base64;
  };

  createImageMaterial = function(url) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      var img;
      if (xhr.readyState === 4) {
        img = new Image();
        img.onload = function() {
          var material, texture;
          texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          material = new THREE.MeshLambertMaterial({
            map: texture
          });
          texture.needsUpdate = true;
          return material;
        };
        return img.src = arrayBufferDataUri(xhr.response);
      }
    };
    return xhr.send();
  };

  module.exports = imageMaker = function(node) {
    return containerMaker(node, createImageMaterial(node.tag));
  };

}).call(this);
