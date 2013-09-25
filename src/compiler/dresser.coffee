module.exports = dresser = (node) ->
  node.options.x ?= 0
  node.options.y ?= 0
  node.options.z = node.depth
  node.options.height ?= 300
  node.options.width ?= 200
  node.options.backgroundColor ?= '#FFFFFF'
  node.options.childType ?= 'vertical'
  for child, index in node.children
    child.options.type = 'block' if node.options.childType is 'horizontal' or node.options.childType is 'vertical'
    child.options.type ?= node.options.childType
    switch node.options.childType
      when 'horizontal'
        child.options.x ?= node.options.width*(index/node.children.length)-((node.options.width/2)-((node.options.width/node.children.length)/2))
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width/node.children.length
        child.options.height ?= node.options.height
      when 'vertical'
        child.options.y ?= node.options.height*(index/node.children.length)-((node.options.height/2)-((node.options.height/node.children.length)/2))
        child.options.x ?= node.options.x
        child.options.height ?= node.options.height/node.children.length
        child.options.width ?= node.options.width
      when 'image', 'text'
        child.options.x ?= node.options.x
        child.options.y ?= node.options.y
        child.options.width ?= node.options.width
        child.options.height ?= node.options.height
      when 'image'
        child.tag = 'http://'.concat(child.tag) if child.tag.slice 0, 7 isnt 'http://'
    dresser child
  node