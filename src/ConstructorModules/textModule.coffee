# Set the fontsize. TODO: make this variable.
fontSize = 16

# create a lookUp hash so that each character doesn't have to be rerendered each time it is needed. TODO: make color work and create a hash for every font and style needed. Multiple fonts.
makeLookUp = (text, color) ->

  hash = {}

  # For each character.
  for character in text
    # If the character isn't already in the hash.
    if not hash[character]?

      # Paint a character on an HTML canvas.

      # Create the canvas and get its context.
      canvas = document.createElement 'canvas'
      context = canvas.getContext '2d'

      # Set it's properties.
      context.font = fontSize*2 + 'px monospace'
      # Set the width dependent on the character size in the canvas' context.
      canvas.width = context.measureText(character).width + 2
      canvas.height = fontSize * 2+10
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = fontSize*2 + 'px monospace'

      # Create a whip the canvas clean
      context.clearRect 0, 0, canvas.width, canvas.height

      # Fill it's color with the given color. TODO: doesn't work as intended.
      context.fillColor = color
      # Write the character to the canvas.
      context.fillText character, canvas.width/2-2, canvas.height/2

      # turn the canvas into a THREE.js texture.
      texture = new THREE.Texture canvas
      # make it into a material.
      face = new THREE.MeshBasicMaterial { map: texture, side: THREE.DoubleSide, transparent: true}
      # create a geometry.
      quad = new THREE.PlaneGeometry canvas.width/2-5, canvas.height/2
      #  combine the geometry and the material to make a mesh.
      letter = new THREE.Mesh quad, face
      # update the texture
      texture.needsUpdate = true
      # stick the mesh into the hash for lookup later.
      hash[character] = letter

  # return the hash
  hash

# Make text puts all the rendered characters into place within lines to form the text content. TODO: make character wrap into word wrap.
makeText = (text, hash, maxWidth, maxHeight) ->
  # group will contain each line.
  group = new THREE.Object3D()
  line = new THREE.Object3D()

  # yPos keeps track of the vertical position of each line.
  yPos = 0

  # render text as long as it fits in it's container vertically.
  for character in text when Math.abs(yPos) < maxHeight

    # xPos keeps track of the offset of each new character horizontally.
    xPos = 0

    # each letter is copied out from the master copy in the hash.
    letter = new THREE.Mesh(hash[character].geometry, hash[character].material)

    # update the xPosition with a little bit of a margin.
    for eachLetter in line.children
      xPos += eachLetter.geometry.width+1

    # set the position of the letter and then offset the line to keep it centered.
    letter.position.x = xPos
    line.position.x = -xPos/2

    # character wrapping if necessary.
    if xPos+letter.geometry.width > maxWidth
      # add the letter
      line.add letter
      # reset xPos
      xPos = 0
      # update yPos to a new Line
      yPos -= letter.geometry.height
      # move the line to it's new position.
      line.position.y = yPos
      # add the line to the group.
      group.add line
      # create a new line.
      line = new THREE.Object3D()
    else
      line.add(letter)

  # when we run out of text grab the last letter if it exists.
  if letter?
    
    # and do a final carriage return for it.
    yPos -= letter.geometry.height
    line.position.y = yPos
    group.add line

    # position the group based on the number of lines and their height, then return the group.
    group.position.y = Math.abs(yPos/2)+letter.geometry.height/2

  group

# textMaker takes in a node and returns a group of rendered characters.
module.exports = textMaker = (node) ->
  
  # create a lookup table to prevent unncessary rerendering of canvases.
  table = makeLookUp node.tag, node.options.backgroundColor

  # create the group of text.
  textElem = makeText node.tag, table, node.options.width, node.options.height

  # move the group of text into position.
  textElem.translateZ node.options.z
  textElem.translateX node.options.x
  textElem.translateY node.options.y

  # return the text.
  textElem