animation = require '../renderer/animationEngine.coffee'

# The Dresser traverses through the sytanx tree and insures that all nodes along the tree have the minimum required information to be rendererd properly.
module.exports = dresser = (node, baseWidth, baseHeight) ->
  # Base case: node is the root of the syntax and so is the largest parent. All children will be placed and sized relative to it.
  node.options.x ?= 0
  node.options.y ?= 0
  # multiply the node depth by 2 so that  elements in the normal flow are placed on even z-values and floated elements are placed on odd.
  node.options.z = node.depth*2
  # If a height and width aren't specified, assume the full window size.
  node.options.width ?= baseWidth ? document.body.scrollWidth
  node.options.height ?= baseHeight ? document.body.scrollHeight

  # house cleaning.
  node.options.backgroundColor ?= '#FFFFFF'
  node.options.childType ?= 'vertical'

  # animation.animationList.push(node) if node.options.animation?

  # Place children relative to parent. Position floats in relation to their normal position.
  for child, index in node.children

    # set Type for easy classification of nodes in the future.
    child.options.type = if node.options.childType is 'horizontal' or node.options.childType is 'vertical' then 'block' else node.options.childType

    # handle floated values so that the element is relative to their parent and so that they are literally floated forward by one Z value.
    if child.options.x? or child.options.y? or child.options.height? or child.options.width?
      child.options.x = (node.options.x + ((child.options.x/100)*(node.options.width)))/2 if child.options.x?
      child.options.y = (node.options.y + ((child.options.y/100)*(node.options.height)))/2 if child.options.y?
      child.options.height = ((child.options.height/100)*node.options.height) if child.options.height?
      child.options.width = ((child.options.width/100)*node.options.width) if child.options.width?
      # literally float them
      child.options.z += 1

    # adjust elements into the normal flow by type.
    switch node.options.childType

      when 'horizontal'
        child.options.x ?= node.options.width*(index/node.children.length)-((node.options.width/2)-((node.options.width/node.children.length)/2))+node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width/node.children.length
        child.options.height ?= node.options.height

      when 'vertical'
        child.options.y ?= ((node.options.height/2)-((node.options.height/node.children.length)/2))-(node.options.height*(index/node.children.length))+node.options.y
        child.options.x ?= node.options.x
        child.options.height ?= node.options.height/node.children.length
        child.options.width ?= node.options.width

      when 'text'
        # text elements directly inherit their parent's position. TODO: impliment options to right/left/top/bottom justify.
        child.options.x ?= node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width
        child.options.height ?= node.options.height
        # failed attempt to change text color to white if the background is black. TODO: make this work.
        if node.options.backgroundColor is '#000000' or node.options.backgroundColor is 'black'
          child.options.backgroundColor ?= 'white'
        else
          child.options.backgroundColor is 'black'

      when 'image'
        # images rightly also inherit parents position.
        child.options.x ?= node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width
        child.options.height ?= node.options.height
        # fix the damage done by the pareser to a URL. This is not the most clean way to do this. TODO: impliment better solution.
        for key, value of child.options
          if key[0] is '/' then child.tag += ':' + key

    # recursively call the function on each child so that all elements in the tree are properly dressed for rendering.
    dresser child

  # return the node.
  node