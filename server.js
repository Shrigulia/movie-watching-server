const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('addDare', (dare) => io.emit('updateDare', dare));
    socket.on('addTruth', (truth) => io.emit('updateTruth', truth));
    socket.on('deleteItem', ({ type, index }) => io.emit('deleteItem', { type, index }));
    socket.on('editItem', ({ type, index, newValue }) => io.emit('editItem', { type, index, newValue }));
    socket.on('sendMessage', ({ username, message }) => io.emit('newMessage', { username, message }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
