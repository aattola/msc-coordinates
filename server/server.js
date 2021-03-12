const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => [
  socket.on('coordinates', data => {
    const { x, z, name, color, id } = data
    if (!x && !z && !name && !color && !id) return

    socket.broadcast.emit('newCoordinates', data)
  })
])

server.listen(3000, () => {
  console.log('Server listening at port %d', 3000);
});
