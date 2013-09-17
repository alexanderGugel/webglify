app = require('express')()
server = require('http').createServer app
io = require('socket.io').listen server
url = require 'url'
jsdom = require 'jsdom'
phantom = require 'phantom'
HTMLparser = require '../parsers/HTMLparser.js'

server.listen(8080)

app.get '/', (req, res) ->
  res.sendfile __dirname + '/index.html'

io.sockets.on 'connection', (socket) ->
  socket.emit 'news', {hello: 'world'}
  socket.on 'submit', (data) ->
    console.log('hello!')
    queryUrl = url.parse(data)
    phantom.create (ph) ->
      ph.createPage (page) ->
        page.open queryUrl, (status) ->
          