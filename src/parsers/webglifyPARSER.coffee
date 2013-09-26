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
    whitespace = line.slice 0, firstNonWhiteSpaceIndex

    # Check to see if there are options specified behind a colon.
    if line.indexOf(':') isnt -1
      # isolate the tagSpace between the first significant character and the colon.
      tagSpace = line.slice firstNonWhiteSpaceIndex, line.indexOf ':'
      # find the options and strip them of whitesplace.
      options = line.slice(line.indexOf(':')+1).replace /\s/g, ''
      # break them into their own array.
      options = options.split ','
      # split each option into pairs to await objectification as key value pairs.
      options = (option.split ':' for option in options)
      # push into malformed our newly created array of abstracted syntax.
      malformed.push [whitespace.length, tagSpace, options]
    else
      # if the line has no options then push all content into the malformed array.
      content = line.slice(firstNonWhiteSpaceIndex)
      malformed.push [whitespace.length, content, []]

  # Check to see if options were bumped down a line from content. I wanted this to be an option if the content was text as parsing out the colon could potentially cause problems. TODO: make this more secure.
  for element, index in malformed when index > 0
    # check if there is no content and only options in the line, then check if the preceeding line has no options, finally check to make sure the whitespace is the same.
    if element[1].length is 0 and malformed[index-1][2].length is 0 and element[0] is malformed[index-1][0]
      # if tests pass, assume that the current line is the options of the previous line.
      malformed[index-1][2] = malformed[index-1][2].concat element[2]

  # properly formed will be the array that holds the objectified, non blank, syntax elements.
  properlyFormed = []
  properlyFormed.push objectifier item for item in malformed when item[1].length isnt 0

  # apply segmenter and inheriter to the properlyFormed array and return their results.
  inheriter segmenter properlyFormed

# objectifier turns syntax arrays into properly formed objects ready to be dressed.
objectifier = (syntaxArr) ->

  object =
    depth: syntaxArr[0]
    tag: syntaxArr[1]
    options: {}
    children: []

  # insert the options as key value pairs.
  object.options[option[0]] = option[1] for option in syntaxArr[2]

  # return the object
  object

# Segmenter takes the array of nodes and segments them such that all nodes are organized in a direct line of parent child relationships with no siblings.
segmenter = (array) ->

  results = []

  # Recurser searches for siblings and splits the array up when they are found.
  recurser = (array2, position) ->
    # count forwards with a potential sibling
    for element, index in array2
      # count backwards looking for a sibling
      for i in [array2.length-1..index+1] by -1
        # if a sibling is found
        if element.depth is array2[i].depth
          # recurse upon the arrays before and after the sibling
          recurser array2.slice(i), position+i
          recurser array2.slice(0, i), position
          # return false to break this level of recursion.
          return false
    # if no siblings were found, then push the siblingless array into results at the position of it's oldest ancestor.
    results[position] = array2

  # remover plucks the ancestor out into their own array.
  remover = (array2) ->
    results2 = []
    for element in array2
      if element?
        results2.push element
    return results2

  # call the recurser
  recurser array, 0
  # pluck the ancestor
  results = remover results
  # return results
  results

# Inheritor makes each node along the branch the child of it's parent then finds the ancestor of each ancestor so that all branches of the tree are now connected.
inheriter = (array) ->
  # first we associate each element in each line of ancestory with their parent.
  for subArray in array
    for j in [subArray.length-1..1] by -1
      child = subArray[j]
      parent = subArray[j-1]
      parent.children.push child
  # then we count backwards through the array.
  for i in [array.length-1..0] by -1
    # to identify each subArray
    subArray = array[i]
    # and make the ancestor of each branch the lostChild of another branch.
    lostChild = subArray[0]
    # we then count backwards through the array to find each potential home for the lostChild.
    for j in [i-1..0] by -1 when i isnt 0
      potentialHome = array[j]
      root = potentialHome[0]
      # if the ancestor of the potential home has less whitespace than the lostChild
      if root.depth < lostChild.depth
        # then we look through the home for a sibling.
        for potentialSibling, index in potentialHome
          # if a sibling was found.
          if potentialSibling.depth is lostChild.depth
            # then that sibling leads us to it's parent. Because we are counting backwards and because the parent already has a child, we have to unshift the lostChild directly behind the child that was already part of the parent's branch.
            potentialHome[index-1].children.splice 1, 0, lostChild
            break
        break
  # return the ancestor of all ancestors: the root of the tree.
  array[0][0]