const express=require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server is up and running on port ${port}`) );


app.use(express.static('../build'));
//app.use(express.static('../public'));


const socket = require('socket.io');
const io = socket(server);
io.on('connection', (socket) =>{
    console.log('browser communicated with server');
    socket.on('button', data => {
        console.log(data);
        io.sockets.emit('button');
    });
    io.sockets.emit('connect');
    socket.on('end', () => socket.disconnect(0));
})