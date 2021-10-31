// This file will create node js server 


const io = require('socket.io')(8080,{ // this is important 
    cors:{origin:"*"}
});

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', username =>{
        // console.log("New user is ", username);
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, username: users[socket.id]});
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',  users[socket.id]);
        delete users[socket.id];
    });


});