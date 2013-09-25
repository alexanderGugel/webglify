module.exports = dresser = (node) ->
  node.options.x ?= 0
  node.options.y ?= 0
  node.options.z = node.depth*2
  node.options.height ?= window.innerHeight
  node.options.width ?= window.innerWidth
  node.options.backgroundColor ?= '#FFFFFF'
  node.options.childType ?= 'vertical'
  for child, index in node.children
    child.options.type = 'block' if node.options.childType is 'horizontal' or node.options.childType is 'vertical'
    child.options.type ?= node.options.childType
    if child.options.x? or child.options.y? or child.options.height? or child.options.width?
      child.options.x = (node.options.x + ((child.options.x/100)*(node.options.width)))/2 if child.options.x?
      child.options.y = (node.options.y + ((child.options.y/100)*(node.options.height)))/2 if child.options.y?
      child.options.height = ((child.options.height/100)*node.options.height) if child.options.height?
      child.options.width = ((child.options.width/100)*node.options.width) if child.options.width?
      child.options.z += 1
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
        child.options.x ?= node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width
        child.options.height ?= node.options.height
        if node.options.backgroundColor is '#000000' or node.options.backgroundColor is 'black'
          console.log 'black detected'
          child.options.backgroundColor ?= 'white'
        else
          child.options.backgroundColor is 'black'
      when 'image'
        child.options.x ?= node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width
        child.options.height ?= node.options.height
        debugger
        console.log child.options
        for key, value of child.options
          if key[0] is '/' then child.tag += key
          console.log child.tag
    dresser child
  node