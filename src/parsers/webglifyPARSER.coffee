# parser takes the raw WebGLify input and returns a syntax tree to be dressed.
module.exports = parser = (text) ->

  # break all lines into string elements in an array.
  lines = text.split '\n'

  # malformed is the array of lines before the lines have objectified and filtered.
  malformed = []

  # for every line:
  for line in lines
    # find the first non white space character.
    firstNonWhiteSpaceIndex = line.indexOf /\S/.exec line
    # isolate the whitespace of the line into it's own array.
    whitespace = line.slice(0, firstNonWhiteSpaceIndex)
    if line.indexOf(':') isnt -1
      tagSpace = line.slice firstNonWhiteSpaceIndex, line.indexOf ':'
      options = line.slice(line.indexOf(':')+1).replace /\s/g, ''
      options = options.split ','
      options = (option.split ':' for option in options)
      malformed.push [whitespace.length, tagSpace, options]
    else
      content = line.slice(firstNonWhiteSpaceIndex)
      malformed.push [whitespace.length, content, []]
  for i in [1..malformed.length-1]
    if malformed[i][1].length is 0 and malformed[i-1][2].length is 0 and malformed[i][0] is malformed[i-1][0]
      malformed[i-1][2] = malformed[i-1][2].concat malformed[i][2]
  properlyFormed = []
  properlyFormed.push objectifier item for item in malformed when item[1].length isnt 0
  inheriter segmenter properlyFormed


objectifier = (element) ->
  object =
    depth: element[0]
    tag: element[1]
    options: {}
    children: []
  object.options[option[0]] = option[1] for option in element[2]
  object

segmenter = (array) ->
  results = []
  recurser = (array2, position) ->
    for element, index in array2
      for i in [array2.length-1..index+1] by -1
        if element.depth is array2[i].depth
          recurser array2.slice(i), position+i
          recurser array2.slice(0, i), position
          return false
    results[position] = array2
  remover = (array2) ->
    results2 = []
    for element in array2
      if element?
        results2.push element
    return results2
  recurser array, 0
  results = remover results
  results

inheriter = (array) ->
  for subArray in array
    for j in [subArray.length-1..1] by -1
      child = subArray[j]
      parent = subArray[j-1]
      parent.children.push child
  for i in [array.length-1..0] by -1
    subArray = array[i]
    lostChild = subArray[0]
    for j in [i-1..0] by -1 when i isnt 0
      potentialHome = array[j]
      root = potentialHome[0]
      if root.depth < lostChild.depth
        for potentialSibling, index in potentialHome
          if potentialSibling.depth is lostChild.depth
            potentialHome[index-1].children.splice 1, 0, lostChild
            break
        break
  array[0][0]