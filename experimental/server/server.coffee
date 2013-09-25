app = require('express')()
server = require('http').createServer app
io = require('socket.io').listen server
url = require 'url'
parser = require '../parsers/webglifyPARSER.coffee'
webglify = require '../app/webglify.coffee'

server.listen(8080)

app.get '/', (req, res) ->
  res.sendfile __dirname + '/index.html'

io.sockets.on 'connection', (socket) ->
  socket.emit 'news', {hello: 'world'}
  socket.on 'submit', (data) ->
    value = data.data
    x = data.windowSize[0]
    y = data.windowSize[1]
    webglify parser value, x, y