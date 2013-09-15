app = require('express')()
server = require('http').createServer(app)
io = require('socket.io').listen(server)
url = require('url')
jsdom = require('jsdom')

server.listen(8080)

app.get '/', (req, res) ->
  res.sendfile __dirname + '/index.html'

io.sockets.on 'connection', (socket) ->
  socket.emit 'news', {hello: 'world'}
  socket.on 'submit', (data) ->
    queryUrl = url.parse(data)
    jsdom.env {url: queryUrl.href, scripts: ['http://code.jquery.com/jquery.js'], done: (errors, window) ->
      text = getElementsByTagName(window.document)
      console.log text
      # socket.emit 'return', xyOfText
    }

getElementsByTagName = (el) ->
  elements = el.getElementsByTagName 'p'
  results = []
  for element in elements
    console.log(element)
    console.log(element.childNodes[0])
    results.push element.childNodes[0].nodeValue
  return elements