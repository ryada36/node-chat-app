const express=require('express');
const http=require('http');
const path=require('path');
const socketIO=require('socket.io');

var {generateMessage,generateLocationURL} =require('./utils/utils');

var publicPath=path.join(__dirname,'./../public/');

var port=process.env.PORT || 3000;

var app=express();
app.use(express.static(publicPath));

var server=http.createServer(app);
var io=socketIO(server);

server.listen(port,()=>{
    console.log('Server runnint at ',port);
});



io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    });
    socket.on('send-message',(data,callback)=>{
        io.emit('new-message',generateMessage(data.from,data.text));
        callback();
    });
    socket.on('send-location',(data)=>{
        io.emit('new-location',generateLocationURL(data.from,data.lat,data.lng))
    })
})


