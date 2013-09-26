WebGLify = require './webglify.coffee'

window.wglify =
  renderBlock: (block, node) ->
    webglifyObj = @WebGLify block, node.scrollWidth, node.scrollHeight
    node.appendChild webglifyObj.node
    node.getGLifyInstance = ->
      return instance
    instance =
      node: node
      canvas: webglifyObj.node
      setSize: (width, height) ->
        @width = @node.scrollWidth
        @height = @node.scrollHeight
        if @width isnt @canvas.width or @height isnt @canvas.height
          @render
      render: (block) ->
        webglifyObj.render()
    instance.render()
    instance
  populateContent: ->
    scripts = (Array.prototype.slice.call document.querySelectorAll '[type="text/WebGLify"]').concat Array.prototype.slice.call document.querySelectorAll '[src*="WebGLify.js"]'
    instances = []
    for script in scripts
      continue if not script.innerHTML?
      nodes = document.querySelectorAll script.getAttribute('target') or 'body'
      if nodes.length?
        instances.push wglify.renderBlock script.innerHTML, nodes[0]
    window.addEventListener 'resize', (evt) ->
      for instance in instances
        instance.setSize
  WebGLify: require './webglify.coffee'

document.addEventListener 'DOMContentLoaded', (event) ->
  wglify.populateContent()