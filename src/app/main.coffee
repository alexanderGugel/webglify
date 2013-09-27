WebGLify = require './webglify.coffee'
# animate = require '../renderer/animationEngine.coffee'

window.wglify =

  #associate a rendered webgl scene with a dom node. The block is the WebGlify code and the node is the dom element.
  renderBlock: (block, node) ->
    # create the webglify object from the block of code
    webglifyObj = @WebGLify block, node.scrollWidth, node.scrollHeight

    # apply it to the target node
    node.innerHTML = ''
    node.appendChild webglifyObj.node

    # define a function that allows the container node to report it's instance of webglify
    node.getGLifyInstance = ->
      instance

    # define the instance of webglify
    instance =
      # container node
      node: node
      # canvas element in which the scene is rendered
      canvas: webglifyObj.node
      #function to rerender whenever the size changes
      setSize: (width, height) ->
        @width = width ? @node.scrollWidth
        @height = height ? @node.scrollHeight
        if @width isnt @canvas.width or @height isnt @canvas.height
          #TODO: complete setSize function. only rerenders currently, should change size: consider using THREEx.WindowResize
          @render @width, @height

      elements: webglifyObj.elements

      #function to allow rerendering directly on the instance
      render: ->
        webglifyObj.render @width, @height
    

    #render the instance on initialization
    instance.setSize()
    instance.render()

    # if animate.animationList.length?
    #   animate.animate()

    #return the instance
    instance

  #collect the target DOM elements and create an instance for them.
  populateContent: ->

    #collect all relevent script tags.
    scripts1 = Array.prototype.slice.call document.querySelectorAll '[src*="WebGLify.js"]'
    scripts2 = Array.prototype.slice.call document.querySelectorAll '[type="text/WebGLify"]'
    scripts = scripts1.concat scripts2

    #store the instances
    instances = []

    #create a function to return all webglify instances
    @getInstances = ->
      instances

    #for each script
    for script in scripts
      #check if the script is empty
      continue if not script.innerHTML?
      #get all targets or default to the body if none are given
      nodes = document.querySelectorAll script.getAttribute('target') or 'body'
      # if there are targeted nodes
      if nodes.length?
        nodes[0].style.margin = 0 if not script.getAttribute('target')?
        # then create an instance and push it into the collection of instances
        instances.push wglify.renderBlock script.innerHTML, nodes[0]

    # add a resize event listener. TODO: make this work.
    # window.addEventListener 'resize', (evt) ->
    #   for instance in instances
    #     instance.setSize
  #give our wglify object access to the WebGLify function
  WebGLify: require './webglify.coffee'

#run on DOM ready
window.onload = ->
  wglify.populateContent()