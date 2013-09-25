containerMaker = require './containerModule.coffee'

arrayBufferDataUri = (raw) ->
  base64 = ''
  encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  bytes = new Uint8Array(raw)
  byteLength = bytes.byteLength
  byteRemainder = byteLength % 3
  mainLength = byteLength - byteRemainder
  for i in [0..mainLength] by 3
    chunk = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2]
    a = (chunk & 16515072) >> 18
    b = (chunk & 258048) >> 12
    c = (chunk & 4032) >> 6
    d = chunk & 63
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  if byteRemainder is 1
    chunk = bytes mainLength
    a = (chunk & 252) >> 2
    b = (chunk & 3) << 4
    base64 += encodings[a] + encodings[b] + '=='
  else if byteRemainder is 1
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
    a = (chunk & 16128) >> 8
    b = (chunk & 1008) >> 4
    c = (chunk & 15) << 2
    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  return "data:image/jpeg;base64," + base64

createImageMaterial = (url) ->
  xhr = new XMLHttpRequest()
  xhr.responseType = 'arraybuffer'
  xhr.open 'GET', url, true
  xhr.onreadystatechange = ->
    if xhr.readyState is 4
      img = new Image()
      img.onload = ->
        texture = new THREE.Texture(img)
        texture.needsUpdate = true
        material = new THREE.MeshLambertMaterial {map: texture}
        texture.needsUpdate = true
        return material
      img.src = arrayBufferDataUri xhr.response
  xhr.send()

module.exports = imageMaker = (node) ->
  containerMaker node, createImageMaterial node.tag
