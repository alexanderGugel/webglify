wgify =
  renderBlock: (block, node) ->
    node.innerHTML = block
    node.getGLifyInstance = ->
      return instance
    instance:
      node: node
      setSize: (width, height) ->
        @width ?= node.scrollWidth
        @height ?= node.scrollHeight
        if @width isnt @canvas.width or @height isnt @canvas.height
          @render
      render: (block) ->
        # render
    instance
  populateContent: ->
    scripts = (Array.prototype.slice.call document.querySelectorAll '[type="text/webglify"]').concat Array.prototype.slice.call document.querySelectorAll '[src*="webglify.js"]'
    instances = []
    for script in scripts
      continue if not script.innerHTML?
      nodes = document.querySelectorAll script.getAttribute('target') or 'body'
      if nodes.length?
        instances.push wgify.renderBlock script.innerHTML, nodes[0]
    window.addEventListener 'resize', (evt) ->
      for instance in instances
        instance.setSize