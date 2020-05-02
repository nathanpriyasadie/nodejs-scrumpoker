const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const {
  addUser,
  getUser,
  getAdmin,
  setMessage,
  getUsers,
  getUsersWithoutMessage,
  removeUser,
  resetMessage,
} = require("./utils/users");
const { addTask } = require("./utils/tasks");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("join", (options, callback) => {
    console.log("generated id", socket.id);
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) return callback(error);
    console.log("options", user.room);
    socket.join(user.room);
    io.to(user.room).emit("user", getUsersWithoutMessage(user.room));
  });

  socket.on("task", (task) => {
    const { error, user } = getAdmin(socket.id);
    if (error) {
      return console.log(error);
    }
    resetMessage(user.room);
    const newTask = addTask({ room: user.room, task });
    console.log("task untuk dikirim", newTask);
    io.to(user.room).emit("task", newTask);
    io.to(user.room).emit("user", getUsersWithoutMessage(user.room));
  });

  socket.on("message", (message) => {
    const { error, user } = getUser(socket.id);
    if (error) console.log(error);
    const users = setMessage({ id: socket.id, message });
    console.log("users", users);
    io.to(user.room).emit("message", users);
  });

  socket.on("reveal", () => {
    const { error, user } = getAdmin(socket.id);
    console.log(user);
    if (error) return console.log(error);
    io.to(user.room).emit("user", getUsers(user.room));
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
  });
});

server.listen(port, () => {
  console.log("Server listening on port", port);
});
