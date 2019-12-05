const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const Filter = require("bad-words");
const {
    generateMessage,
    generateLocationMessages
} = require("../src/utils/messages");

const {
    addUser,
    removedUser,
    getUser,
    getUsersInRoom
} = require("./utils/users");

io.on("connection", socket => {
    socket.on("join", ({ userName, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username: userName,
            room
        });

        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit("message", generateMessage("Admin", "Welcome!"));
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                generateMessage("Admin", `${user.username} has joined!`)
            );
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    });
    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed");
        }
        io.to(getUser(socket.id).room).emit(
            "message",
            generateMessage(getUser(socket.id).username, message)
        );
        callback();
    });

    socket.on("sendLocation", ({ latitude, longitude }, callback) => {
        io.to(getUser(socket.id).room).emit(
            "locationMessage",
            generateLocationMessages(
                getUser(socket.id).username,
                `https://google.com/maps?q=${latitude},${longitude}`
            )
        );
        callback();
    });

    socket.on("disconnect", () => {
        const user = removedUser(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message",
                generateMessage("Admin", `${user.username} has left`)
            );

            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

const static = path.join(__dirname, "../public");

const port = process.env.PORT || 5000;
app.use(express.static(static));

server.listen(port, () => {
    console.log("Express server started on Port " + port);
});