const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser,userLeave,getRoomUser } = require('./utils/users.js');
// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord';

// RUn when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        
        const user = userJoin(socket.id, username, room);
        console.log("user......", user);

        socket.join(user.room);

        // welcome current user
        socket.emit('message', formatMessage(username, 'Welcome to chatCord')); // it will emit to connecting user itself

        // Broadcast the message means emitting message to everybody except connecting client
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat`));  
    
       // send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUser(user.room)
        });
    
    });

    // listen for chatMessage  
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        const user = getCurrentUser(socket.id);
        console.log("user chatroom ", user);
        // emit to all the user in chatroom 
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when Client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

    // emit to all the user in corresponding chat room
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            // send user and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUser(user.room)
            });

        }
    })
});

app.get("/", (req, res) => {
    console.log(req.url);
    app.render("index")
})



// listen to port 3000
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`listening to port  ${PORT}`);
});