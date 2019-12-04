const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const Filter = require("bad-words");

io.on("connection", socket => {
    socket.emit("message", "Welcome");
    socket.broadcast.emit("message", "A new user has joined");
    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed");
        }
        io.emit("message", message);
        callback();
    });

    socket.on("sendLocation", ({ latitude, longitude }, callback) => {
        io.emit("message", `https://google.com/maps?q=${latitude},${longitude}`);
        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left");
    });
});

const static = path.join(__dirname, "../public");

const port = process.env.PORT || 5000;
app.use(express.static(static));

server.listen(port, () => {
    console.log("Express server started on Port " + port);
});