module.exports = parser = (text) ->
  lines = text.split '\n'
  malformed = []
  for line in lines
    firstNonWhiteSpaceIndex = line.indexOf /\S/.exec line
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
  recurser = (array2) ->
    for element, index in array2
      for i in [array2.length-1..index+1] by -1
        if element.depth is array2[i].depth
          recurser array2.slice i
          recurser array2.slice 0, i
          return false
    results.unshift array2
  recurser array
  results

inheriter = (array) ->
  for subArray in array
    for j in [subArray.length-1..1] by -1
      child = subArray[j]
      parent = subArray[j-1]
      parent.children.push child
  for subArray, index in array when index isnt array.length-1
    lostChild = array[index+1][0]
    for potentialSibling, index in subArray
      if potentialSibling.depth is lostChild.depth
        subArray[index-1].children.push lostChild
  array[0][0]