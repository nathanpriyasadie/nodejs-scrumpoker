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
  const id = socket.id;
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id, ...options });
    if (error) return callback(error);
    socket.join(user.room);
    io.to(user.room).emit("user", getUsersWithoutMessage(user.room));
  });

  socket.on("task", (task, callback) => {
    const { error, user } = getAdmin(id);
    if (error) {
      return callback(error);
    }
    resetMessage(user.room);
    const newTask = addTask({ room: user.room, task });
    io.to(user.room).emit("task", newTask);
    io.to(user.room).emit("user", getUsersWithoutMessage(user.room));
  });

  socket.on("message", (message, callback) => {
    const { error, user } = getUser(id);
    if (error) callback(error);
    const users = setMessage({ id, message });
    io.to(user.room).emit("message", users);
  });

  socket.on("reveal", (callback) => {
    const { error, user } = getAdmin(id);
    if (error) return callback(error);
    io.to(user.room).emit("user", getUsers(user.room));
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(id);
  });
});

server.listen(port, () => {
  console.log("Server listening on port", port);
});
