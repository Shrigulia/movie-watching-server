const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // updated import
const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for all origins in Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins
        methods: ["GET", "POST"], // allowed methods
    },
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('addDare', (dare) => io.emit('updateDare', dare));
    socket.on('addTruth', (truth) => io.emit('updateTruth', truth));
    socket.on('addDiary', (diary) => io.emit('updateDiary', diary));
    socket.on('deleteItem', ({ type, index }) => io.emit('deleteItem', { type, index }));
    socket.on('editItem', ({ type, index, newValue }) => io.emit('editItem', { type, index, newValue }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${ PORT }`))
