const {
  addUser,
  getUser,
  getAdmin,
  setMessage,
  getUsers,
  getUsersWithoutMessage,
  removeUser,
  resetMessage,
} = require("../../models/user");
const { addTask } = require("../../models/task");

exports.listenToChat = (io) => {
  io.on("connection", (socket) => {
    console.log("new connection");
    const id = socket.id;
    socket.on("join", (options, callback) => {
      console.log("join", options);
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
      console.log(newTask);
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
};
