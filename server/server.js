const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const {messageCreator,locationMessageCreator}=require('./utiles/message');
const {isString} =require("./utiles/validation");
const {Users} =require('./utiles/user');

const publicPath = path.join(__dirname,'../public/');
const app = express();
const port = process.env.PORT||3000;

app.use(express.static(publicPath));
const server = http.createServer(app);
const io = SocketIO(server);
const users=new Users();

io.on('connection',function (socket){
    console.log("New user is connected");

    

    


    socket.on("createMessage",(message,callback)=>{
        const user = users.getUser(socket.id);
        if(user&&isString(message.text)){
            io.to(user.room).emit("NewMessage", messageCreator(user.name,message.text)) ;    
            return callback()
        }
    });
    socket.on("sendUserLocation",(position,callback)=>{
        const user = users.getUser(socket.id);
        if(user&&!isString(user.text)){      
            io.to(user.room).emit("locationMessage", locationMessageCreator(user.name,position.latitude,position.longitude)) ; 
            return callback()
        }

    })



    socket.on("newRoomUser",(param,callback)=>{
            if(!isString(param.user)||!isString(param.room)){
                return callback("User name and Room name are required")
            } else {
                socket.join(param.room);
                users.removeUser(socket.id);
                users.addUser(socket.id,param.user,param.room);
                io.to(param.room).emit("roomList", users.getRoomUsers(param.room));
                socket.emit("NewMessage", messageCreator("Admin",`Welcome ${param.user} in room: ${param.room}`) );
                socket.broadcast.to(param.room).emit("NewMessage", messageCreator("Admin",`${param.user} is connected`));
                callback()
            }
        });
        socket.on('disconnect',()=>{
            const user = users.removeUser(socket.id);
            if(user){
                io.to(user.room).emit("roomList", users.getRoomUsers(user.room));
                io.to(user.room).emit("NewMessage",messageCreator("Admin",`${user.name} has left.`))
           }
        });

})

 
server.listen(port,()=>{
    console.log(`the port is ${port}`);
    
})
