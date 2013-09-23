module.exports = dresser = (syntax) ->
  syntax.options.x ?= -window.innerwidth/2
  syntax.options.y ?= -window.innerheight/2
  syntax.options.height ?= window.innerheight
  syntax.options.width ?= window.innerwidth
  syntax.options.backgroundcolor ?= '#FFFFFF'
  syntax.options.childtype ?= 'vertical'
  for child, index in syntax.children
    child.options._parentX ?= syntax.options.x
    child.options._parentY ?= syntax.options.y
    if syntax.options.childType is 'horizontal'
      if syntax.children[index-1]? then child.options.x ?= syntax.children[index-1].options.width else child.options.x ?= syntax.options.x
      child.options.y ?= syntax.options.y
    if syntax.options.childType is 'vertical'
      if syntax.children[index-1]? then child.options.y ?= syntax.children[index-1].options.height else child.options.y ?= syntax.options.y
      child.options.x ?= syntax.options.x
    