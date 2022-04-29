const path = require("path");
const http = require("http");
const express = require("express");
const soketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = soketio(server);
const port = process.env.PORT || 3100  ;
const BotName = "Admin Bot";


// set static folder 
app.use(express.static(path.join(__dirname, "public")));


// when new connection 
io.on('connection', socket => {

    // join the room 
    socket.on("joinRoom", ({ username, room, userId }) => {

        if (userId !== null && getCurrentUser(userId) !== undefined) {
            socket.emit("message", formatMessage(BotName, "Welcome Back!<br> You need to close previous window to <a href=''>Continue</a>."));

            // get the user already exists 
            let user = getCurrentUser(userId);
            // broadcast message to everybody in a room when user connect 
            socket.broadcast.to(user.room).emit(
                "message",
                formatMessage(BotName, `${user.username} has joined again.`)
            );

            // send all users in a room 
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUser(user.room)
            });


        } else {

            // add to the user list 
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);

            // Welcome the new user 
            socket.emit("userSocketId", socket.id); // send it to the client side for localstorage 
            socket.emit("message", formatMessage(BotName, "Welcome to Chat"));

            // broadcast message to everybody in a room when user connect 
            socket.broadcast.to(user.room).emit(
                "message",
                formatMessage(BotName, `${user.username} has joined the chat`)
            );

            // send user and room 
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUser(user.room)
            });

        }

    });

    //    listen for chatMessage 
    socket.on("chatMessage", (msg) => {
        const currentUser = getCurrentUser(socket.id);
        io.to(currentUser.room).emit("message", formatMessage(currentUser.username, msg));
    });


    // when client disconnect 
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit("message", formatMessage(BotName, `${user.username} has left the room`));
        }
    });

});


server.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});