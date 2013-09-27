module.exports = (code, styles) ->
  for child in styles.children
    options = {}
    selector = child.tag
    options[child2.tag] = Object.keys(child2.options)[0] for child2 in child.children
    matched = recursiveSearch(code, selector)
    for element in matched
      for property, value of options
        element.options[property] = value
  code


recursiveSearch = (node, term) ->
  results = []
  searcher = (node, term) ->
    for key, value of node.options
      if term is key and value is 'style'
        results.push node
    searcher(child, term) for child in node.children
  searcher node, term
  results