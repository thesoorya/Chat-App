const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://chat-app-client-6e4e.onrender.com",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (data) => {
        console.log('User joining room:', data);
        socket.join(data);

        const roomSize = io.sockets.adapter.rooms.get(data)?.size || 0;
        console.log(`User ${socket.id} joined room ${data}. Room size: ${roomSize}`);

        io.to(data).emit('room_size', { room: data, size: roomSize });
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
    });
})

server.listen(5000, () => {
    console.log('Server Started');
});
