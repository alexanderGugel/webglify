module.exports = (code, styles) ->
  # apply the styles associated with the selector to the elements who need them.
  for child in styles.children
    options = {}
    selector = child.tag
    options[child2.tag] = Object.keys(child2.options)[0] for child2 in child.children
    matched = recursiveSearch(code, selector)
    for element in matched
      for property, value of options
        element.options[property] = value
  code

# Find all nodes with a particular selector.
recursiveSearch = (node, term) ->
  results = []
  searcher = (node, term) ->
    for key, value of node.options
      if term is key and value is 'style'
        results.push node
    searcher(child, term) for child in node.children
  searcher node, term
  results