app = require('express')()
server = require('http').createServer app
io = require('socket.io').listen server
url = require 'url'
jsdom = require 'jsdom'
phantom = require 'phantom'
HTMLparser = require '../parsers/HTMLparser.js'
peg = require 'pegjs'

server.listen(8080)

app.get '/', (req, res) ->
  res.sendfile __dirname + '/index.html'

io.sockets.on 'connection', (socket) ->
  socket.emit 'news', {hello: 'world'}
  socket.on 'submit', (data) ->
    # parser data
    # console.log data
    # console.log parser data
    socket.emit 'return', parser data

parser = (text) ->
  lines = text.split '\n'
  malformed = []
  for line in lines
    firstNonWhiteSpaceIndex = line.indexOf /\S/.exec line
    whitespace = line.slice(0, firstNonWhiteSpaceIndex)
    if line.indexOf(':') isnt -1
      tagSpace = line.slice firstNonWhiteSpaceIndex, line.indexOf ':'
      options = line.slice(line.indexOf(':')+1).replace /\s/g, ''
      options = options.split ','
      options = (option.split ':' for option in options)
      malformed.push [whitespace.length, tagSpace, options]
    else
      content = line.slice(firstNonWhiteSpaceIndex)
      malformed.push [whitespace.length, content, []]
  #  join
  for i in [1..malformed.length-1]
    if malformed[i][1].length is 0 and malformed[i-1][2].length is 0 and malformed[i][0] is malformed[i-1][0]
      malformed[i-1][2] = malformed[i-1][2].concat malformed[i][2]
  properlyFormed = []
  properlyFormed.push objectifier item for item in malformed when item[1].length isnt 0
  segmenter properlyFormed


objectifier = (element) ->
  object =
    depth: element[0]
    tag: element[1]
    options: {}
    children: []
  object.options[option[0]] = option[1] for option in element[2]
  object

segmenter = (array) ->
  array = [array]
  m = 0
  while array[m]?
    temp = []
    for element in array[m]
      lastValue = array[m].length
      for i in [array[m].length-1..0] by -1
        if element.depth is array[m][i].depth
          temp.unshift array[m].slice(i, lastValue)
          lastValue = i
    console.log 'temp is ', temp
    array[m] = temp
    m++
  for element in array
    for i in [element.length-1..1] by -1
      element[i-1].children.push element[i].pop()
  console.log array
  for i in [array.length-1..1] by -1
    array[i-1].children.push array[i]
  array[0]