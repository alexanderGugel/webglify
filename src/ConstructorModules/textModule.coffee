fontSize = 16

makeLookUp = (text, color) ->
  hash = {}
  for character in text
    if not hash[character]?
      canvas = document.createElement 'canvas'
      context = canvas.getContext '2d'
      context.font = fontSize*2 + 'px monospace'
      canvas.width = context.measureText(character).width + 2
      canvas.height = fontSize * 2+10
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = fontSize*2 + 'px monospace'
      context.clearRect 0, 0, canvas.width, canvas.height
      context.fillColor = color
      context.fillText character, canvas.width/2-2, canvas.height/2
      texture = new THREE.Texture canvas
      face = new THREE.MeshBasicMaterial { map: texture, side: THREE.DoubleSide, transparent: true}
      quad = new THREE.PlaneGeometry canvas.width/2-5, canvas.height/2
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
      xPos += eachLetter.geometry.width+1
    letter.position.x = xPos
    line.position.x = -xPos/2
    if xPos+letter.geometry.width > maxWidth
      line.add letter
      xPos = 0
      yPos -= letter.geometry.height
      line.position.y = yPos
      group.add line
      line = new THREE.Object3D()
    else
      letter.position.x = xPos
      line.position.x = -xPos/2
      line.add(letter)
  yPos -= letter.geometry.height
  line.position.y = yPos
  group.add line
  group.position.y = Math.abs(yPos/2)+letter.geometry.height/2
  return group

module.exports = textMaker = (node) ->
  table = makeLookUp node.tag, node.options.backgroundColor
  textElem = makeText node.tag, table, node.options.width, node.options.height
  textElem.translateZ node.options.z
  textElem.translateX node.options.x
  textElem.translateY node.options.y
  textElem