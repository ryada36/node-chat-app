const express=require('express');
const http=require('http');
const path=require('path');
const socketIO=require('socket.io');

var {generateMessage,generateLocationURL} =require('./utils/utils');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var publicPath=path.join(__dirname,'./../public/');

var port=process.env.PORT || 3000;

var app=express();
app.use(express.static(publicPath));

var server=http.createServer(app);
var io=socketIO(server);
var users = new Users();

server.listen(port,()=>{
    console.log('Server runnint at ',port);
});



io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('new-message', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('disconnect',()=>{
       var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('new-message', generateMessage('Admin', `${user.name} has left.`));
        }
    });
    socket.on('send-message',(message,callback)=>{
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
        io.to(user.room).emit('new-message', generateMessage(user.name, message.text));
        }

         callback();
    });
    socket.on('send-location',(coords)=>{
       var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('new-location', generateLocationMessage(user.name, coords.lat, coords.lng));  
        }
    })
})


