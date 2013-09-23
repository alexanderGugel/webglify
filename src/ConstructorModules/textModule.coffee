makeLookUp = (text, fontSize) ->
  hash = {}
  for character in text
    canvas = document.createElement 'canvas'
    context = canvas.getContext '2d'
    canvas.width = (context.measureText character).width + 3
    canvas.height = fontSize * 1.5
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = fontSize + 'px monospace'
    context.clearRect 0, 0, canvas.width, canvas.height
    context.fillStyle = '0xFFFFFFF'
    context.fillText character, canvas.width/2+0.3, canvas.height/2
    texture = new THREE.Texture canvas
    face = new THREE.MeshBasicMaterial { map: texture, side: THREE.DoubleSide}
    quad = new THREE.PlaneGeometry canvas.width, canvas.height
    letter = new THREE.Mesh quad, face
    texture.needsUpdate = true
    hash[character] = letter
  return hash

makeText = (text, hash, maxWidth, maxHeight) ->
  group = new THREE.Object3D()
  line = new THREE.Object3D()
  yPos = 0
  for character in text when Math.abs yPos < maxHeight
    xPos = 0
    letter = new THREE.Mesh(hash[character].geometry, hash[character].material)
    for eachLetter in line.children
      xPos += eachLetter.geometry.width+5
    letter.position.x = xPos
    line.position.x = -xPos/2
    if xPos > maxWidth
      line.add letter
      xPos = 0
      yPos -= fontSize*1.5
      line.position.y = yPos
      group.add line
      line = new THREE.Object3D()
    else
      line.add(letter)
  yPos -= fontSize*1.5
  line.position.y = yPos
  group.add line
  group.position.y = Math.abs yPos/2
  return group

getTextElem = (text, fontSize, maxWidth, maxHeight, depth) ->
  table = makeLookUp text, fontSize
  textElem = makeText text, table, maxWidth, maxHeight
  textElem.traslateZ depth
  return textElem