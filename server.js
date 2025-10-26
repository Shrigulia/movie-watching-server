const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET','POST'] }
});

// app.use(express.static(__dirname)); // serve html, css, js

const rooms = {};

io.on('connection', socket => {

    socket.on('join', room => {
        socket.join(room);
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(socket.id);
        io.to(room).emit('joined', { users: rooms[room].length });
    });

    socket.on('movie-event', data => socket.to(data.room).emit('movie-event', data));

    socket.on('chat', data => io.to(data.room).emit('chat', data));

    socket.on('offer', data => socket.to(data.room).emit('offer', data));
    socket.on('answer', data => socket.to(data.room).emit('answer', data));
    socket.on('ice-candidate', data => socket.to(data.room).emit('ice-candidate', data));

    socket.on('disconnect', () => {
        for (let room in rooms) {
            rooms[room] = rooms[room].filter(id => id !== socket.id);
            if (rooms[room].length===0) delete rooms[room];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
