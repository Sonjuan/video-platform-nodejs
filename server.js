const express = require('express');
const app = express();
const http = require('http');
const {v4:uuidv4} = require('uuid');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { ExpressPeerServer, PeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

const hostname = 'localhost';
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        
        socket.on('message', (message) => {
            
            to.to(roomId).emit('createMessage', message);
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});