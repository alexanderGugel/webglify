module.exports = dresser = (syntax) ->
  syntax.options.x ?= -window.innerwidth/2
  syntax.options.y ?= -window.innerheight/2
  syntax.options.z ?= syntax.options.depth
  syntax.options.height ?= window.innerheight
  syntax.options.width ?= window.innerwidth
  syntax.options.backgroundColor ?= '#FFFFFF'
  syntax.options.childType ?= 'vertical'
  for child, index in syntax.children
    child.options.type = if syntax.options.childType isnt 'horizontal' or syntax.options.childType isnt 'vertical' then syntax.options.childType else 'block'
    child.options._parentX ?= syntax.options.x
    child.options._parentY ?= syntax.options.y
    switch syntax.options.childType
      when 'horizontal'
        if syntax.children[index-1]? then child.options.x ?= syntax.children[index-1].options.width else child.options.x ?= syntax.options.x
        child.options.y ?= syntax.options.y
        child.options.width ?= syntax.options.width/syntax.children.length
        child.options.height ?= syntax.options.height
      when 'vertical'
        if syntax.children[index-1]? then child.options.y ?= syntax.children[index-1].options.height else child.options.y ?= syntax.options.y
        child.options.x ?= syntax.options.x
        child.options.height ?= syntax.options.height/syntax.children.length
        child.options.width ?= syntax.options.width
      when 'image', 'text'
        child.options.x ?= syntax.options.x
        child.options.y ?= syntax.options.y
        child.options.width ?= syntax.options.width
        child.options.height ?= syntax.options.height
      when 'image'
        child.tag = 'http://'.concat(child.tag) if child.tag.slice 0, 7 isnt 'http://'
    dresser child
  syntax