
# findElementsByType = (type, element) ->
#   results = []
#   recurseSearch = (type, element) ->
#     for node in element
#       if node.type is type
#         results.push node.data
#       recurseSearch type, node.children if node.children
#   recurseSearch type, element
#   results

# class HTMLparser
#   constructor: (@type) ->
#   parse: (html) ->
#     handler = new htmlparse.DefaultHandler (error, dom) ->
#       if error
#         console.log 'error'
#       else
#         @divs = findElementsByType 'div', dom
#         @text = findElementsByType 'text', dom
#     parser = new htmlparse.Parser(handler)
#     parser.parseComplete html
#     {div: handler.divs, text: handler.text}

