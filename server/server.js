const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server)

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
        
    })
    
})

server.listen(5000, () => {
    console.log('Server Started');
    
})